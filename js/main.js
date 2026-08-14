/**
 * main.js - Luis Felipe Leão Portfolio Scripts
 * JS Vanilla focado em performance, acessibilidade e interatividade.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. HIGHLIGHT ATIVO NO MENU VIA INTERSECTION OBSERVER
     ========================================================================== */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Aciona quando a seção ocupa o foco principal da tela
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('nav__link--active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ==========================================================================
     2. EFEITO SPOTLIGHT / GLOW DINÂMICO NOS CARDS (SEGUIDOR DE CURSOR)
     ========================================================================== */
  const cards = document.querySelectorAll('.tech-card, .project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Atualiza variáveis CSS que o arquivo style.css utiliza
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     3. SCROLL REVEAL (ANIMAÇÃO DE ENTRADA SUAVE)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.tech-card, .project-card, .stacks__title, .hero__content');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        revealObserver.unobserve(entry.target); // Anima apenas uma vez
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.classList.add('reveal-init');
    revealObserver.observe(el);
  });

  /* ==========================================================================
     4. EFEITO DIGITAÇÃO (TYPEWRITER) NA HERO SECTION
     ========================================================================== */
  const subtitleElement = document.querySelector('.hero__subtitle');
  const phrases = [
    'JavaScript & TypeScript Specialist',
    'Full-Stack Developer',
    'NestJS & React Developer'
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!subtitleElement) return;

    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      subtitleElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      subtitleElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pausa a leitura quando termina de digitar
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  /* ==========================================================================
     5. CÓPIA RÁPIDA DE E-MAIL COM FEEDBACK VISUAL
     ========================================================================== */
  const mailButtons = document.querySelectorAll('a[href^="mailto:"]');

  mailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const email = btn.getAttribute('href').replace('mailto:', '');
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = 'E-mail Copiado! ✓';
          
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2500);
        }).catch(err => {
          console.error('Erro ao copiar e-mail: ', err);
        });
      }
    });
  });

  /* ==========================================================================
     6. METRICAS DINÂMICAS DO GITHUB (OPCIONAL/INTEGRAÇÃO)
     ========================================================================== */
  async function fetchGithubInfo(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) return;
      
      const data = await response.json();
      
      // Exemplo: Atualiza a tag da hero section com repositórios públicos
      const tagElement = document.querySelector('.hero__tag');
      if (tagElement && data.public_repos) {
        tagElement.textContent = `AVAILABLE FOR WORK • ${data.public_repos} PUBLIC REPOS ON GITHUB`;
      }
    } catch (error) {
      console.log('GitHub API offline ou atingiu limite de requisições.');
    }
  }

  fetchGithubInfo('SrMaestro');
});