// ========================================
// Theme Management
// ========================================
const THEME_KEY = 'calvinpang-theme';
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    // Default to system preference if no saved theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
}

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.theme-icon');
    if (theme === 'dark') {
        icon.classList.remove('ri-moon-line');
        icon.classList.add('ri-sun-line');
    } else {
        icon.classList.remove('ri-sun-line');
        icon.classList.add('ri-moon-line');
    }
}

themeToggle.addEventListener('click', toggleTheme);

// ========================================
// Terminal Typing Animation
// ========================================
function typeWriter(element, text, speed = 50) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        
        type();
    });
}

async function initTerminal() {
    const cmdElement = document.querySelector('.cmd');
    const jsonOutput = document.querySelector('.json-output');
    
    if (!cmdElement || !jsonOutput) return;
    
    // Hide initially
    jsonOutput.style.opacity = '0';
    
    // Reset text
    const cmdText = cmdElement.textContent;
    cmdElement.textContent = '';
    
    // Wait a bit then start typing
    await new Promise(r => setTimeout(r, 1000));
    await typeWriter(cmdElement, cmdText, 100);
    
    // Show output
    await new Promise(r => setTimeout(r, 300));
    jsonOutput.style.opacity = '1';
    jsonOutput.style.transition = 'opacity 0.5s ease';
}

// ========================================
// Intersection Observer for Animations
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animations based on index in the current batch
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function initAnimations() {
    const elements = document.querySelectorAll('.glass-panel, .section-title, .hero-content > *');
    
    elements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========================================
// Navigation Menu
// ========================================
function initNavMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function toggleMenu() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    }
    
    function closeMenuFunc() {
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target)) {
            closeMenuFunc();
        }
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenuFunc);
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenuFunc();
        }
    });
}

// ========================================
// Smooth Scroll & Active Nav
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTerminal();
    initAnimations();
    initNavMenu();
    initSmoothScroll();
    
    console.log('%c Designed & Built by Calvin Pang ', 'background: #2563eb; color: white; padding: 4px; border-radius: 4px;');
});
