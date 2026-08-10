/**
 * Vortex Studio - Premium Dark / Light Mode Engine
 * Handles real functional theme toggling, logo switching, and localStorage persistence.
 */

(function () {
    'use strict';

    function getStoredTheme() {
        return localStorage.getItem('vortex_theme');
    }

    function getSystemPreference() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function getCurrentTheme() {
        const stored = getStoredTheme();
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
        return getSystemPreference();
    }

    function applyTheme(theme, animate) {
        const root = document.documentElement;
        
        if (animate) {
            root.classList.add('theme-transitioning');
        }

        root.setAttribute('data-theme', theme);
        if (theme === 'light') {
            root.classList.add('light');
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
            root.classList.remove('light');
        }

        localStorage.setItem('vortex_theme', theme);
        updateThemeUI(theme);

        if (animate) {
            setTimeout(() => {
                root.classList.remove('theme-transitioning');
            }, 350);
        }
    }

    function updateThemeUI(theme) {
        const isLight = theme === 'light';
        const logoSrc = isLight ? 'assets/logo 5.png' : 'assets/logo 4.png';

        // Update all brand logo images
        document.querySelectorAll('.logo-brand').forEach(img => {
            if (img.getAttribute('src') !== logoSrc) {
                img.src = logoSrc;
            }
        });

        // Update all theme toggle buttons
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            const nextThemeLabel = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
            btn.setAttribute('aria-label', nextThemeLabel);
            btn.setAttribute('title', nextThemeLabel);

            const icon = btn.querySelector('i');
            if (icon) {
                if (isLight) {
                    // Light Mode active -> show Moon icon indicating "switch to dark mode"
                    icon.className = 'ph ph-moon text-lg transition-transform duration-300 transform rotate-0';
                } else {
                    // Dark Mode active -> show Sun icon indicating "switch to light mode"
                    icon.className = 'ph ph-sun text-lg transition-transform duration-300 transform rotate-0';
                }
            }
        });
    }

    function toggleTheme() {
        const current = getCurrentTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
    }

    // Immediate theme initialization before page render (prevents FOUC)
    const initialTheme = getCurrentTheme();
    document.documentElement.setAttribute('data-theme', initialTheme);
    if (initialTheme === 'light') {
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.add('dark');
    }

    // Attach listeners when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        const activeTheme = getCurrentTheme();
        applyTheme(activeTheme, false);

        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleTheme();
            });
        });

        // Monitor OS color scheme changes if user hasn't set explicit preference
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
                if (!getStoredTheme()) {
                    applyTheme(e.matches ? 'light' : 'dark', true);
                }
            });
        }
    });

    // Global helper object
    window.vortexTheme = {
        get: getCurrentTheme,
        set: (theme) => applyTheme(theme, true),
        toggle: toggleTheme
    };
})();
