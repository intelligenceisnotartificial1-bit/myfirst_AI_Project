// =============================================
// THREE.JS 3D BACKGROUND SETUP
// =============================================

let scene, camera, renderer, particles;

function init3DBackground() {
    // Scene setup
    const container = document.getElementById('3d-canvas');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9ff);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 50;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(50, 50, 50);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    scene.add(pointLight);

    // Create floating particles
    createFloatingParticles();

    // Create rotating geometric shapes
    createGeometricShapes();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createFloatingParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200;
        positions[i + 1] = (Math.random() - 0.5) * 200;
        positions[i + 2] = (Math.random() - 0.5) * 200;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x6366f1,
        size: 0.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createGeometricShapes() {
    // Rotating cube
    const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        emissive: 0x3b34de,
        wireframe: false,
        opacity: 0.1,
        transparent: true
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-30, 20, -50);
    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;
    scene.add(cube);

    // Rotating sphere
    const sphereGeometry = new THREE.SphereGeometry(15, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b5cf6,
        emissive: 0x6d28d9,
        wireframe: false,
        opacity: 0.1,
        transparent: true
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(30, -20, -50);
    scene.add(sphere);

    // Rotating torus
    const torusGeometry = new THREE.TorusGeometry(20, 5, 32, 32);
    const torusMaterial = new THREE.MeshPhongMaterial({
        color: 0xec4899,
        emissive: 0xbe185d,
        wireframe: false,
        opacity: 0.1,
        transparent: true
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(0, 0, -50);
    scene.add(torus);

    // Animate shapes
    gsap.to(cube.rotation, {
        x: '+=6.28',
        y: '+=6.28',
        duration: 20,
        repeat: -1,
        ease: 'none'
    });

    gsap.to(sphere.rotation, {
        y: '+=6.28',
        z: '+=3.14',
        duration: 15,
        repeat: -1,
        ease: 'none'
    });

    gsap.to(torus.rotation, {
        x: '+=6.28',
        y: '+=3.14',
        duration: 18,
        repeat: -1,
        ease: 'none'
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate particles
    if (particles) {
        particles.rotation.x += 0.0002;
        particles.rotation.y += 0.0003;
    }

    // Update particles position for floating effect
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.0001 + i) * 0.01;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('3d-canvas');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

// =============================================
// GSAP ANIMATIONS
// =============================================

function initGSAPAnimations() {
    // Stagger category cards on scroll
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.category-card').forEach((card) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                markers: false
            },
            duration: 0.6,
            opacity: 1,
            y: 0
        });
    });

    // Animate feature cards
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%'
            },
            duration: 0.8,
            opacity: 0,
            y: 50,
            delay: index * 0.1
        });
    });

    // Animate payment methods
    gsap.utils.toArray('.payment-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            duration: 0.8,
            opacity: 0,
            scale: 0.9,
            delay: index * 0.08
        });
    });

    // Animate statistics
    gsap.utils.toArray('.stat-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%'
            },
            duration: 1,
            opacity: 0,
            y: 30,
            delay: index * 0.1
        });
    });

    // Animate stats numbers on scroll
    gsap.utils.toArray('.stat-card h3').forEach((heading) => {
        const target = { value: 0 };
        const finalValue = parseInt(heading.textContent);

        gsap.to(target, {
            scrollTrigger: {
                trigger: heading,
                start: 'top 80%'
            },
            value: finalValue,
            duration: 2,
            onUpdate: function() {
                if (finalValue.toString().includes('K')) {
                    heading.textContent = Math.floor(target.value).toLocaleString() + 'K+';
                } else if (finalValue.toString().includes('%')) {
                    heading.textContent = Math.floor(target.value) + '.8%';
                } else {
                    heading.textContent = Math.floor(target.value).toLocaleString() + '/7';
                }
            }
        });
    });
}

// =============================================
// SCROLL EFFECTS
// =============================================

function initScrollEffects() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;

        if (lastScrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        heroSection.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    });
}

// =============================================
// SMOOTH SCROLL NAVIGATION
// =============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// =============================================
// BUTTON INTERACTIONS
// =============================================

function initButtonInteractions() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.05,
                ease: 'back.out'
            });
        });

        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                ease: 'back.out'
            });
        });

        button.addEventListener('click', function() {
            gsap.to(this, {
                duration: 0.2,
                scale: 0.95,
                ease: 'back.out',
                onComplete: () => {
                    gsap.to(this, {
                        duration: 0.2,
                        scale: 1,
                        ease: 'back.out'
                    });
                }
            });

            // Show notification
            showNotification('Action clicked!');
        });
    });
}

// =============================================
// CARD HOVER EFFECTS
// =============================================

function initCardHoverEffects() {
    const cards = document.querySelectorAll('.category-card, .feature-card, .payment-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -10,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            });
        });

        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            gsap.to(this, {
                duration: 0.3,
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: 'preserve-3d'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                rotateX: 0,
                rotateY: 0
            });
        });
    });
}

// =============================================
// NOTIFICATION SYSTEM
// =============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#ef4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    gsap.to(notification, {
        delay: 2,
        duration: 0.3,
        opacity: 0,
        y: 20,
        onComplete: () => {
            notification.remove();
        }
    });
}

// =============================================
// EXPLORE BUTTON INTERACTIONS
// =============================================

function initExploreButtons() {
    const exploreButtons = document.querySelectorAll('.btn-explore');

    exploreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.closest('.category-card').getAttribute('data-category');

            // Animate to payment section
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: document.querySelector('#payment'),
                    offsetY: 100
                },
                ease: 'power2.inOut'
            });

            showNotification(`Exploring ${category.replace('-', ' ')}...`);
        });
    });
}

// =============================================
// PAYMENT CARD INTERACTIONS
// =============================================

function initPaymentInteractions() {
    const paymentCards = document.querySelectorAll('.payment-card');

    paymentCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const paymentMethod = this.querySelector('h3').textContent;
            showNotification(`${paymentMethod} payment method selected!`);

            // Highlight selected card
            paymentCards.forEach(c => {
                c.style.borderColor = '#e2e8f0';
                c.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #f0f3ff 100%)';
            });

            this.style.borderColor = '#6366f1';
            this.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)';

            gsap.to(this, {
                duration: 0.3,
                scale: 1.05
            });
        });
    });
}

// =============================================
// INTERSECTION OBSERVER FOR LAZY ANIMATIONS
// =============================================

function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.category-card, .feature-card, .payment-card').forEach(el => {
        observer.observe(el);
    });
}

// =============================================
// PERFORMANCE OPTIMIZATION
// =============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =============================================
// RESPONSIVE 3D CANVAS
// =============================================

function setupResponsive3D() {
    if (window.innerWidth < 768) {
        // Reduce particle count on mobile
        if (particles && particles.geometry.attributes.position.array.length > 150) {
            scene.remove(particles);
            createFloatingParticles();
        }
    }
}

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D background
    setTimeout(() => {
        init3DBackground();
    }, 100);

    // Initialize other features
    initGSAPAnimations();
    initScrollEffects();
    initSmoothScroll();
    initButtonInteractions();
    initCardHoverEffects();
    initExploreButtons();
    initPaymentInteractions();
    initIntersectionObserver();

    // Responsive setup
    setupResponsive3D();
    window.addEventListener('resize', debounce(setupResponsive3D, 250));

    // Add scroll-to-top button
    createScrollToTopButton();
});

// =============================================
// SCROLL TO TOP BUTTON
// =============================================

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        z-index: 999;
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });

    button.addEventListener('click', () => {
        gsap.to(window, {
            duration: 1,
            scrollTo: 0,
            ease: 'power2.inOut'
        });
    });

    button.addEventListener('mouseenter', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1.15
        });
    });

    button.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1
        });
    });
}

// =============================================
// ADD SCROLLTRIGGER PLUGIN
// =============================================

gsap.registerPlugin(ScrollTrigger);

// Update ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// =============================================
// ERROR HANDLING
// =============================================

window.addEventListener('error', (e) => {
    console.error('Error:', e.message);
});

// Handle 3D canvas cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
    }
});
