// ========================================
// Theme Management
// ========================================
const THEME_KEY = 'calvinpang-theme';
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Initialize theme from localStorage or default to dark mode
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const initialTheme = savedTheme || 'dark'; // Always default to dark mode
    
    setTheme(initialTheme);
}

// Set theme and update UI
function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon(theme);
}

// Toggle between light and dark themes
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Update theme toggle icon
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀' : '◐';
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// ========================================
// Smooth Scrolling & Active Nav
// ========================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Update active nav link on scroll
function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Throttle scroll events for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        updateActiveNav();
    });
});

// ========================================
// Fade-in Animation on Scroll
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// ========================================
// Easter Eggs & Fun Interactions
// ========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    const terminal = document.querySelector('.terminal-body');
    const originalContent = terminal.innerHTML;
    
    terminal.innerHTML = `
        <p class="terminal-line">
            <span class="prompt">$</span> sudo make me a sandwich
        </p>
        <p style="color: #00ff00;">✓ Sandwich made successfully!</p>
        <p style="color: #cccccc; margin-top: 1rem;">
            🎉 You found the easter egg! Konami code still works in 2025.
        </p>
    `;
    
    setTimeout(() => {
        terminal.innerHTML = originalContent;
    }, 3000);
}

// Console message for developers
function consoleGreeting() {
    const styles = [
        'font-size: 16px',
        'font-family: monospace',
        'color: #00ff00',
        'background-color: #000',
        'padding: 10px',
        'border: 2px solid #00ff00'
    ].join(';');
    
    console.log('%c Hello, fellow developer! 👋', styles);
    console.log('%c Looking for something? Check out the source on GitHub!', 'font-family: monospace; color: #3399ff;');
    console.log('%c $ git clone https://github.com/calvinpang/calvinpang-com', 'font-family: monospace; color: #666;');
}

// ========================================
// Performance Monitoring
// ========================================
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
            
            // Log to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'load',
                    'value': pageLoadTime,
                    'event_category': 'Performance'
                });
            }
        });
    }
}

// ========================================
// Initialize Everything
// ========================================
function init() {
    initTheme();
    consoleGreeting();
    logPerformance();
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// Utility Functions
// ========================================

// Copy email to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Email copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Show notification toast
function showNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Export for potential use
window.calvinsWebsite = {
    setTheme,
    toggleTheme,
    copyToClipboard,
    showNotification
};
