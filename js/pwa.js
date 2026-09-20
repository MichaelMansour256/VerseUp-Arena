/**
 * VerseUp Arena - PWA Initialization
 * Handles service worker registration, install prompt, and standalone detection.
 */

const PWA = {
    KEYS: {
        INSTALL_PROMPT_DISMISSED: 'verseup-install-dismissed'
    },
    
    deferredPrompt: null,
    isStandalone: false,
    isInstalled: false,
    
    init() {
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        this.checkInstalled();
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupInstallBanner();
    },
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(reg => {
                        console.log('[PWA] SW registered:', reg.scope);
                        reg.addEventListener('updatefound', () => {
                            const newWorker = reg.installing;
                            if (newWorker) {
                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        console.log('[PWA] New SW available');
                                    }
                                });
                            }
                        });
                    })
                    .catch(err => console.error('[PWA] SW registration failed:', err));
            });
        }
    },
    
    checkInstalled() {
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (this.isStandalone || window.navigator.standalone === true) {
            this.isInstalled = true;
            this.hideInstallBanner();
        }
    },
    
    setupInstallPrompt() {
        if (!('BeforeInstallPromptEvent' in window)) return;
        
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this.deferredPrompt = event;
            this.showInstallBanner();
        });
    },
    
    setupInstallBanner() {
        const banner = document.getElementById('install-banner');
        if (!banner) return;
        
        if (this.shouldShowBanner()) {
            this.showInstallBanner();
        }
        
        const installBtn = document.getElementById('install-btn');
        const dismissBtn = document.getElementById('dismiss-install');
        
        if (installBtn) installBtn.addEventListener('click', () => this.installApp());
        if (dismissBtn) dismissBtn.addEventListener('click', () => this.dismissBanner());
    },
    
    showInstallBanner() {
        const banner = document.getElementById('install-banner');
        if (banner) banner.classList.add('visible');
    },
    
    hideInstallBanner() {
        const banner = document.getElementById('install-banner');
        if (banner) banner.classList.remove('visible');
        this.deferredPrompt = null;
    },
    
    dismissBanner() {
        this.hideInstallBanner();
        try {
            const expiry = Date.now() + (14 * 24 * 60 * 60 * 1000);
            localStorage.setItem(this.KEYS.INSTALL_PROMPT_DISMISSED, expiry.toString());
        } catch (e) {}
    },
    
    shouldShowBanner() {
        if (this.isStandalone || this.isInstalled) return false;
        
        try {
            const dismissed = localStorage.getItem(this.KEYS.INSTALL_PROMPT_DISMISSED);
            if (dismissed && Date.now() < parseInt(dismissed, 10)) return false;
        } catch (e) {}
        
        if (!('BeforeInstallPromptEvent' in window)) return false;
        
        return true;
    },
    
    installApp() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        
        this.deferredPrompt.userChoice
            .then(choice => {
                if (choice.outcome === 'accepted') {
                    console.log('[PWA] User accepted install');
                }
                this.deferredPrompt = null;
                this.hideInstallBanner();
                try {
                    const expiry = Date.now() + (7 * 24 * 60 * 60 * 1000);
                    localStorage.setItem(this.KEYS.INSTALL_PROMPT_DISMISSED, expiry.toString());
                } catch (e) {}
            })
            .catch(err => {
                console.error('[PWA] Install error:', err);
                this.deferredPrompt = null;
            });
    }
};

function initializePWA() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PWA.init());
    } else {
        PWA.init();
    }
}
