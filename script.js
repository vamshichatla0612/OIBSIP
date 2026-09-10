/* ==========================================================================
   Chatla Vamshi - 3D Animated Interactive Logic & WebGL Engine
   Features: Three.js 3D Background Canvas, 3D Hover Card Tilt, Skill Filters, Theme Toggle, Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Three.js Interactive 3D Background Engine
  // ==========================================================================
  initThreeJSBackground();

  function initThreeJSBackground() {
    const canvas = document.getElementById('canvas-3d');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00b4d8, 1.3);
    dirLight1.position.set(20, 20, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0077b6, 1.1);
    dirLight2.position.set(-20, -20, -20);
    scene.add(dirLight2);

    // 3. Floating 3D Geometries Group
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    // Material definitions
    const wireframeCyanMat = new THREE.MeshPhongMaterial({
      color: 0x00b4d8,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });

    const wireframeSapphireMat = new THREE.MeshPhongMaterial({
      color: 0x0077b6,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const glossyIceMat = new THREE.MeshPhongMaterial({
      color: 0x90e0ef,
      shininess: 90,
      transparent: true,
      opacity: 0.55
    });

    // Add 3D Torus (Donut)
    const torusGeo = new THREE.TorusGeometry(5, 1.8, 16, 50);
    const torusMesh = new THREE.Mesh(torusGeo, wireframeCyanMat);
    torusMesh.position.set(-18, 10, -5);
    shapesGroup.add(torusMesh);

    // Add 3D Dodecahedron
    const dodecGeo = new THREE.DodecahedronGeometry(4);
    const dodecMesh = new THREE.Mesh(dodecGeo, glossyIceMat);
    dodecMesh.position.set(20, 12, -8);
    shapesGroup.add(dodecMesh);

    // Add 3D Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const icoMesh = new THREE.Mesh(icoGeo, wireframeSapphireMat);
    icoMesh.position.set(16, -14, -6);
    shapesGroup.add(icoMesh);

    // Add Floating Small Orbs
    const orbGeo = new THREE.SphereGeometry(1.2, 32, 32);
    for (let i = 0; i < 15; i++) {
      const orbMat = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? 0x00b4d8 : 0x0077b6,
        transparent: true,
        opacity: 0.5
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30
      );
      shapesGroup.add(orbMesh);
    }

    // 4. Interactive Particle Constellation Network
    const particleCount = 120;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 70;
      positions[i + 1] = (Math.random() - 0.5) * 70;
      positions[i + 2] = (Math.random() - 0.5) * 40;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: 0x90e0ef,
      size: 0.45,
      transparent: true,
      opacity: 0.7
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // 5. Cursor Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - windowHalfX) * 0.001;
      mouseY = (e.clientY - windowHalfY) * 0.001;
    });

    // 6. Animation Loop
    function animate() {
      requestAnimationFrame(animate);

      // Smooth parallax camera lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 12;
      camera.position.y = -targetY * 12;
      camera.lookAt(scene.position);

      // Rotate 3D floating shapes
      torusMesh.rotation.x += 0.006;
      torusMesh.rotation.y += 0.008;

      dodecMesh.rotation.x += 0.004;
      dodecMesh.rotation.y += 0.005;

      icoMesh.rotation.x -= 0.005;
      icoMesh.rotation.z += 0.006;

      shapesGroup.rotation.y += 0.002;
      particleSystem.rotation.y += 0.001;

      renderer.render(scene, camera);
    }
    animate();

    // 7. Window Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ==========================================================================
  // 2. Interactive 3D Mouse Hover Card Tilt Engine
  // ==========================================================================
  init3DTiltEffect();

  function init3DTiltEffect() {
    const tiltCards = document.querySelectorAll('[data-tilt-card]');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardWidth = rect.width;
        const cardHeight = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate rotation degrees (-12deg to +12deg)
        const rotateX = (mouseY / cardHeight - 0.5) * -16;
        const rotateY = (mouseX / cardWidth - 0.5) * 16;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  }

  // ==========================================================================
  // 3. Theme Toggle (Light / Dark Mode)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const currentTheme = localStorage.getItem('vamshi-portfolio-theme') || 'light';

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.className = 'fas fa-moon';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      if (activeTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('vamshi-portfolio-theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        showToast('Switched to Warm Pastel Light Mode ☀️');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('vamshi-portfolio-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        showToast('Switched to 3D Sleek Dark Mode 🌙');
      }
    });
  }

  // ==========================================================================
  // 4. Navbar Scroll Effect & ScrollSpy Active Links
  // ==========================================================================
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-active');
      const icon = mobileMenuBtn.querySelector('i');
      if (navLinksContainer.classList.contains('mobile-active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-active');
        mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
      });
    });
  }

  // Back to Top Button Click
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 5. Skills Filter & Progress Bar Animations
  // ==========================================================================
  const skillFilterBtns = document.querySelectorAll('.skills-filter .filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Skill progress bar fill animation on scroll
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  const observerOptions = { threshold: 0.3 };

  const animateSkills = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-progress') || '85%';
        bar.style.width = targetWidth;
        observer.unobserve(bar);
      }
    });
  };

  const skillsObserver = new IntersectionObserver(animateSkills, observerOptions);
  progressBars.forEach(bar => skillsObserver.observe(bar));

  // ==========================================================================
  // 6. Projects Filter
  // ==========================================================================
  const projectFilterBtns = document.querySelectorAll('.projects-filter .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 7. Modal Popups (Resume Viewer & Project Details)
  // ==========================================================================
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBodyContent = document.getElementById('modal-body-content');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  const viewProjectBtns = document.querySelectorAll('.view-project-btn');

  const projectDetailsMap = {
    'project-1': {
      title: 'Sales & E-Commerce Analytics App',
      category: 'Web Development / E-Commerce',
      desc: 'An interactive web application built with HTML5, CSS3, and JavaScript featuring cart state management, checkout simulation, and sales analytics charts.',
      techs: ['HTML5', 'CSS3', 'JavaScript', 'Glassmorphism UI', 'Chart.js'],
      features: [
        'Real-time total price & discount calculations',
        'Filter products by categories & price ranges',
        'Pastel glassmorphic UI dashboard',
        'Responsive mobile navigation'
      ]
    },
    'project-2': {
      title: 'Data Science Predictive Insights',
      category: 'Data Science & Python',
      desc: 'Exploratory data analysis pipeline inspecting complex dataset trends, statistical distribution charts, and predictive machine learning models.',
      techs: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-Learn', 'MS Excel'],
      features: [
        'Data cleaning & outlier removal pipeline',
        'Correlation heatmaps & feature distribution analysis',
        'Predictive model training (Regression & Classification)',
        'Exportable summary reports'
      ]
    },
    'project-3': {
      title: '3D Interactive Web Application',
      category: 'Web Development / Three.js 3D',
      desc: 'Interactive 3D glassmorphic portfolio platform with WebGL dynamic particles, floating 3D shapes, and real-time cursor tilt physics.',
      techs: ['Three.js', 'React', 'CSS 3D Transforms', 'WebGL', 'JavaScript'],
      features: [
        'Interactive Three.js particle constellation',
        'Card hover 3D tilt perspective math',
        'Light/Dark pastel theme engine',
        'Optimized WebGL rendering loop'
      ]
    },
    'project-4': {
      title: 'Media & Graphic Studio Showcase',
      category: 'Creative Design & Editing',
      desc: 'A curated collection of vector poster artwork, brand identity guidelines, marketing banners, and video motion edits.',
      techs: ['Graphic Design', 'Video Editing', 'Vector Art', 'UI Mockups'],
      features: [
        'High-resolution vector design assets',
        'Short-form motion video cuts',
        'Brand color palettes & typography systems'
      ]
    }
  };

  // Open Resume Modal
  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalBodyContent.innerHTML = `
        <div style="text-align:center; padding:1rem;">
          <div class="badge-icon-pill pink" style="margin: 0 auto 1rem auto; width:56px; height:56px; font-size:1.5rem;">
            <i class="fas fa-file-invoice"></i>
          </div>
          <h2 style="font-size:2rem; margin-bottom:0.5rem; color:var(--text-primary);">Chatla Vamshi - Resume</h2>
          <p style="color:var(--tag-color); font-weight:700; margin-bottom:1.5rem;">B.Tech Computer Science Engineering (Data Science Specialization)</p>

          <div style="text-align:left; background:rgba(255,255,255,0.6); padding:1.5rem; border-radius:16px; margin-bottom:1.5rem; border:1px solid var(--card-border);">
            <h4 style="color:var(--text-primary); margin-bottom:0.6rem;">🎓 Education</h4>
            <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:1rem;">
              <strong>B.Tech CSE (Data Science)</strong> • Expected Graduation 2026<br>
              Focus: Frontend Web Development, Python Data Analytics, Database Systems.
            </p>

            <h4 style="color:var(--text-primary); margin-bottom:0.6rem;">💻 Core Technical Skills</h4>
            <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:1rem;">
              HTML5, CSS3, JavaScript (ES6+), React, Python, Data Science, Git & GitHub, MS Excel, Graphic Design, Three.js 3D.
            </p>

            <h4 style="color:var(--text-primary); margin-bottom:0.6rem;">🚀 Internship & Projects</h4>
            <p style="font-size:0.95rem; color:var(--text-secondary);">
              <strong>Oasis Infobyte (OIBSIP) Web Developer Intern:</strong> Developed responsive web applications and interactive 3D portfolios.
            </p>
          </div>

          <button class="btn btn-primary-gradient" onclick="showToast('Resume PDF downloaded successfully!')">
            <i class="fas fa-download"></i> Download Full Resume PDF
          </button>
        </div>
      `;
      modalBackdrop.classList.add('active');
    });
  });

  // Open Project Details Modal
  viewProjectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const data = projectDetailsMap[projId];

      if (data) {
        modalBodyContent.innerHTML = `
          <div>
            <span class="project-tag" style="margin-bottom:0.6rem; display:inline-block;">${data.category}</span>
            <h2 style="font-size:2rem; margin-bottom:0.8rem; color:var(--text-primary);">${data.title}</h2>
            <p style="font-size:1.05rem; color:var(--text-secondary); margin-bottom:1.5rem;">${data.desc}</p>

            <h4 style="color:var(--text-primary); margin-bottom:0.6rem;">Key Features & Architecture:</h4>
            <ul style="list-style-type:disc; padding-left:1.4rem; color:var(--text-secondary); margin-bottom:1.5rem;">
              ${data.features.map(f => `<li style="margin-bottom:0.4rem;">${f}</li>`).join('')}
            </ul>

            <h4 style="color:var(--text-primary); margin-bottom:0.6rem;">Technologies Used:</h4>
            <div class="project-tags" style="margin-bottom:1.8rem;">
              ${data.techs.map(t => `<span class="project-tag">${t}</span>`).join('')}
            </div>

            <div style="display:flex; gap:1rem;">
              <button class="btn btn-primary-gradient" onclick="showToast('Opening live demo link...')">
                <i class="fas fa-external-link-alt"></i> Live Preview
              </button>
              <button class="btn btn-secondary-pill" onclick="showToast('Opening GitHub repository...')">
                <i class="fab fa-github"></i> Source Code
              </button>
            </div>
          </div>
        `;
        modalBackdrop.classList.add('active');
      }
    });
  });

  // Close Modal
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('active');
      }
    });
  }

  // ==========================================================================
  // 8. Contact Form Toast Notification
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been sent successfully 🚀');
      contactForm.reset();
    });
  }

});

// Helper Toast Notification Function
function showToast(msg) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}