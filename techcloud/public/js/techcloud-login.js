// Techcloud Login Page Layout - Two Column Design
// This script restructures the Frappe login page to match the techcloud design

(function() {
    "use strict";
    
    console.log("[Techcloud Login] Script loaded");
    
    // Only run on login page - check multiple ways
    // NOTE: This file can be loaded in <head>, so `document.body` may be null initially.
    function isLoginPage() {
        try {
            const path = (window.location && window.location.pathname) ? window.location.pathname : "";
            const hash = (window.location && window.location.hash) ? window.location.hash : "";
            const hasForLogin = document.querySelector(".for-login") !== null;
            const bodyHasLoginClass = !!document.body && document.body.classList.contains("login-page");
            return bodyHasLoginClass || path.includes("login") || hash.includes("login") || hasForLogin;
        } catch (e) {
            // If DOM isn't ready yet, assume false for now; we'll re-check on init.
            return false;
        }
    }
    
    function restructureLoginPage() {
        console.log("[Techcloud Login] Attempting to restructure...");
        
        // Find the login section
        const loginSection = document.querySelector('.for-login');
        if (!loginSection) {
            console.log("[Techcloud Login] .for-login section not found, retrying...");
            return false;
        }
        
        // Check if already restructured
        if (loginSection.classList.contains('techcloud-restructured')) {
            console.log("[Techcloud Login] Already restructured, skipping");
            return true;
        }
        
        console.log("[Techcloud Login] Found .for-login section, restructuring...");
        
        // Get the parent container
        const parentContainer = loginSection.parentElement;
        if (!parentContainer) {
            console.error("[Techcloud Login] No parent container found");
            return false;
        }
        
        // Create wrapper for two-column layout
        const wrapper = document.createElement('div');
        wrapper.className = 'techcloud-login-wrapper';
        wrapper.style.cssText = `
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            max-width: 1200px !important;
            width: 100% !important;
            background: #FFFFFF !important;
            border-radius: 16px !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1) !important;
            overflow: hidden !important;
            min-height: auto !important;
            margin: 0 auto !important;
        `;
        
        // Create form section (left column)
        const formSection = document.createElement('div');
        formSection.className = 'techcloud-login-form-section';
        formSection.style.cssText = `
            padding: 60px 50px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            background: #FFFFFF !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            overflow-y: auto !important;
        `;
        
        // Get the login content
        const loginContent = loginSection.querySelector('.login-content');
        if (!loginContent) {
            console.error("[Techcloud Login] .login-content not found");
            return false;
        }
        
        // Remove page-card-head (logo section) - we'll add our own
        const pageCardHead = loginContent.querySelector('.page-card-head');
        if (pageCardHead) {
            pageCardHead.remove();
        }
        
        // Add logo
        const logo = document.createElement('div');
        logo.className = 'techcloud-logo';
        logo.textContent = 'techcloud';
        logo.style.cssText = `
            font-size: 28px !important;
            font-weight: 700 !important;
            color: #0089FF !important;
            margin-bottom: 40px !important;
            letter-spacing: -0.5px !important;
        `;
        formSection.appendChild(logo);
        
        // Add title
        const title = document.createElement('h1');
        title.className = 'techcloud-login-title';
        title.textContent = 'Login to your account';
        title.style.cssText = `
            font-size: 32px !important;
            font-weight: 700 !important;
            margin-bottom: 10px !important;
            color: #212121 !important;
        `;
        formSection.appendChild(title);
        
        // Add subtitle
        const subtitle = document.createElement('p');
        subtitle.className = 'techcloud-login-subtitle';
        subtitle.textContent = 'Welcome back! Please enter your details.';
        subtitle.style.cssText = `
            font-size: 16px !important;
            color: #757575 !important;
            margin-bottom: 40px !important;
        `;
        formSection.appendChild(subtitle);
        
        // Clone the form to preserve functionality
        const form = loginContent.querySelector('form.form-signin, form.form-login');
        if (form) {
            const formClone = form.cloneNode(true);
            
            // Style the form container
            formClone.style.cssText = `
                width: 100% !important;
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
            `;
            
            // Style page-card-body
            const pageCardBody = formClone.querySelector('.page-card-body');
            if (pageCardBody) {
                pageCardBody.style.cssText = `
                    padding: 0 !important;
                    background: transparent !important;
                `;
            }
            
            // Style form groups
            const formGroups = formClone.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.style.cssText = `
                    margin-bottom: 24px !important;
                `;
            });
            
            // Style labels (make visible if sr-only)
            const labels = formClone.querySelectorAll('.form-label');
            labels.forEach(label => {
                if (label.classList.contains('sr-only')) {
                    label.classList.remove('sr-only');
                }
                label.style.cssText = `
                    display: block !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    color: #212121 !important;
                    margin-bottom: 8px !important;
                `;
            });
            
            // Style input fields
            const inputs = formClone.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
            inputs.forEach(input => {
                input.style.cssText = `
                    width: 100% !important;
                    padding: 14px 16px !important;
                    font-size: 16px !important;
                    border: 2px solid #E0E0E0 !important;
                    border-radius: 8px !important;
                    transition: all 0.3s ease !important;
                    background: #FFFFFF !important;
                    color: #212121 !important;
                    box-sizing: border-box !important;
                `;
                
                input.addEventListener('focus', function() {
                    this.style.borderColor = '#0089FF';
                    this.style.boxShadow = '0 0 0 3px rgba(0, 137, 255, 0.1)';
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.style.borderColor = '#E0E0E0';
                        this.style.boxShadow = 'none';
                    }
                });
            });
            
            // Style email and password field containers
            const emailField = formClone.querySelector('.email-field');
            const passwordField = formClone.querySelector('.password-field');
            if (emailField) {
                emailField.style.cssText = `
                    position: relative !important;
                    width: 100% !important;
                `;
            }
            if (passwordField) {
                passwordField.style.cssText = `
                    position: relative !important;
                    width: 100% !important;
                `;
            }
            
            // Style forgot password link
            const forgotLink = formClone.querySelector('.forgot-password-message a');
            if (forgotLink) {
                forgotLink.style.cssText = `
                    display: block !important;
                    text-align: right !important;
                    font-size: 14px !important;
                    color: #0089FF !important;
                    text-decoration: none !important;
                    margin-bottom: 30px !important;
                    transition: color 0.3s ease !important;
                `;
                forgotLink.addEventListener('mouseenter', function() {
                    this.style.color = '#0066CC';
                });
                forgotLink.addEventListener('mouseleave', function() {
                    this.style.color = '#0089FF';
                });
            }
            
            // Style login button
            const pageCardActions = formClone.querySelector('.page-card-actions');
            if (pageCardActions) {
                pageCardActions.style.cssText = `
                    padding: 0 !important;
                    margin-top: 0 !important;
                `;
            }
            
            const loginBtn = formClone.querySelector('.btn-primary, .btn-login');
            if (loginBtn) {
                loginBtn.style.cssText = `
                    width: 100% !important;
                    padding: 14px 24px !important;
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    border: none !important;
                    border-radius: 8px !important;
                    background: #0089FF !important;
                    color: #FFFFFF !important;
                    transition: all 0.3s ease !important;
                    cursor: pointer !important;
                    margin-bottom: 0 !important;
                `;
                
                loginBtn.addEventListener('mouseenter', function() {
                    this.style.background = '#0066CC';
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 12px rgba(0, 137, 255, 0.3)';
                });
                
                loginBtn.addEventListener('mouseleave', function() {
                    this.style.background = '#0089FF';
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });
            }
            
            // Add form to form section
            formSection.appendChild(formClone);
        }
        
        // Add social login section
        const socialLogin = document.createElement('div');
        socialLogin.className = 'techcloud-social-login';
        socialLogin.style.cssText = `
            margin-top: 30px !important;
            text-align: center !important;
        `;
        
        const socialLoginText = document.createElement('p');
        socialLoginText.className = 'techcloud-social-login-text';
        socialLoginText.textContent = 'Or continue with';
        socialLoginText.style.cssText = `
            font-size: 14px !important;
            color: #757575 !important;
            margin-bottom: 20px !important;
            position: relative !important;
        `;
        
        // Add lines before and after "Or continue with"
        const beforeLine = document.createElement('span');
        beforeLine.style.cssText = `
            position: absolute !important;
            top: 50% !important;
            left: 0 !important;
            width: 40% !important;
            height: 1px !important;
            background: #E0E0E0 !important;
        `;
        const afterLine = document.createElement('span');
        afterLine.style.cssText = `
            position: absolute !important;
            top: 50% !important;
            right: 0 !important;
            width: 40% !important;
            height: 1px !important;
            background: #E0E0E0 !important;
        `;
        socialLoginText.appendChild(beforeLine);
        socialLoginText.appendChild(afterLine);
        socialLogin.appendChild(socialLoginText);
        
        // Social buttons container
        const socialButtons = document.createElement('div');
        socialButtons.className = 'techcloud-social-buttons';
        socialButtons.style.cssText = `
            display: flex !important;
            gap: 12px !important;
            justify-content: center !important;
        `;
        
        // Google button
        const googleBtn = createSocialButton('Google', 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z');
        socialButtons.appendChild(googleBtn);
        
        // Apple button
        const appleBtn = createSocialButton('Apple', 'M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z');
        socialButtons.appendChild(appleBtn);
        
        // Facebook button
        const facebookBtn = createSocialButton('Facebook', 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z');
        socialButtons.appendChild(facebookBtn);
        
        // Twitter button
        const twitterBtn = createSocialButton('Twitter', 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z');
        socialButtons.appendChild(twitterBtn);
        
        socialLogin.appendChild(socialButtons);
        formSection.appendChild(socialLogin);
        
        // Add signup link
        const signupLink = document.createElement('div');
        signupLink.className = 'techcloud-signup-link';
        signupLink.style.cssText = `
            text-align: center !important;
            margin-top: 30px !important;
            font-size: 14px !important;
            color: #757575 !important;
        `;
        signupLink.innerHTML = `Don't have an account? <a href="#" style="color: #0089FF; text-decoration: none; font-weight: 600;">Sign up</a>`;
        const signupAnchor = signupLink.querySelector('a');
        if (signupAnchor) {
            signupAnchor.addEventListener('mouseenter', function() {
                this.style.textDecoration = 'underline';
            });
            signupAnchor.addEventListener('mouseleave', function() {
                this.style.textDecoration = 'none';
            });
        }
        formSection.appendChild(signupLink);
        
        // Create illustration section (right column)
        const illustrationSection = document.createElement('div');
        illustrationSection.className = 'techcloud-login-illustration-section';
        illustrationSection.style.cssText = `
            background: linear-gradient(135deg, #0089FF 0%, #0066CC 100%) !important;
            padding: 60px 50px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            color: #FFFFFF !important;
            position: relative !important;
            overflow: hidden !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
        `;
        
        const illustrationContent = document.createElement('div');
        illustrationContent.className = 'techcloud-illustration-content';
        illustrationContent.style.cssText = `
            text-align: center !important;
            z-index: 1 !important;
        `;
        
        const illustrationTitle = document.createElement('h2');
        illustrationTitle.className = 'techcloud-illustration-title';
        illustrationTitle.textContent = 'Simplify your business with techcloud ERP';
        illustrationTitle.style.cssText = `
            font-size: 32px !important;
            font-weight: 700 !important;
            margin-bottom: 20px !important;
            color: #FFFFFF !important;
        `;
        illustrationContent.appendChild(illustrationTitle);
        
        const illustrationSubtitle = document.createElement('p');
        illustrationSubtitle.className = 'techcloud-illustration-subtitle';
        illustrationSubtitle.textContent = 'Effortlessly manage your team and operations with our comprehensive ERP solution.';
        illustrationSubtitle.style.cssText = `
            font-size: 18px !important;
            opacity: 0.9 !important;
            line-height: 1.6 !important;
            color: #FFFFFF !important;
            margin-bottom: 40px !important;
        `;
        illustrationContent.appendChild(illustrationSubtitle);
        
        // Add illustration graphic
        const illustrationGraphic = document.createElement('div');
        illustrationGraphic.className = 'techcloud-illustration-graphic';
        illustrationGraphic.style.cssText = `
            width: 100% !important;
            max-width: 400px !important;
            height: 300px !important;
            margin: 40px auto !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
        `;
        
        // Add SVG illustration
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '300');
        svg.setAttribute('height', '200');
        svg.setAttribute('viewBox', '0 0 300 200');
        svg.setAttribute('fill', 'none');
        
        // Network nodes illustration
        const circles = [
            {cx: 150, cy: 100, r: 40},
            {cx: 80, cy: 60, r: 25},
            {cx: 220, cy: 60, r: 25},
            {cx: 80, cy: 140, r: 25},
            {cx: 220, cy: 140, r: 25}
        ];
        
        const lines = [
            {x1: 150, y1: 100, x2: 95, y2: 70},
            {x1: 150, y1: 100, x2: 205, y2: 70},
            {x1: 150, y1: 100, x2: 95, y2: 130},
            {x1: 150, y1: 100, x2: 205, y2: 130}
        ];
        
        lines.forEach(line => {
            const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            lineEl.setAttribute('x1', line.x1);
            lineEl.setAttribute('y1', line.y1);
            lineEl.setAttribute('x2', line.x2);
            lineEl.setAttribute('y2', line.y2);
            lineEl.setAttribute('stroke', 'rgba(255,255,255,0.4)');
            lineEl.setAttribute('stroke-width', '2');
            svg.appendChild(lineEl);
        });
        
        circles.forEach(circle => {
            const circleEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circleEl.setAttribute('cx', circle.cx);
            circleEl.setAttribute('cy', circle.cy);
            circleEl.setAttribute('r', circle.r);
            circleEl.setAttribute('fill', circle.r === 40 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.25)');
            circleEl.setAttribute('stroke', 'rgba(255,255,255,0.5)');
            circleEl.setAttribute('stroke-width', '2');
            svg.appendChild(circleEl);
        });
        
        illustrationGraphic.appendChild(svg);
        illustrationContent.appendChild(illustrationGraphic);
        illustrationSection.appendChild(illustrationContent);
        
        // Assemble wrapper
        wrapper.appendChild(formSection);
        wrapper.appendChild(illustrationSection);
        
        // Replace login section content
        loginSection.innerHTML = '';
        loginSection.appendChild(wrapper);
        loginSection.classList.add('techcloud-restructured');
        
        // Apply body styles dynamically (requested).
        // Use setProperty(..., 'important') so it reliably overrides defaults.
        if (document.body) {
            // Optional background / sizing (enable if you want it active)
            document.body.style.setProperty(
                "background",
                "linear-gradient(135deg, rgb(227, 242, 253) 0%, rgb(255, 255, 255) 100%)",
                "important"
            );
            document.body.style.setProperty("margin", "0px", "important");

            // Required by you
            document.body.style.setProperty("box-sizing", "border-box", "important");
            document.body.style.setProperty("overflow-x", "hidden", "important");
        }
        
        // Style the main container
        const mainContainer = document.querySelector('.page-content, main, .container');
        if (mainContainer) {
            mainContainer.style.cssText = `
                min-height: calc(100vh - 40px) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0 !important;
                margin: 0 !important;
            `;
        }
        
        // Hide other sections (signup, forgot, etc.) initially
        const otherSections = document.querySelectorAll('section:not(.for-login)');
        otherSections.forEach(section => {
            section.style.display = 'none';
        });
        
        console.log("[Techcloud Login] ✅ Restructure complete!");
        return true;
    }
    
    // Helper function to create social buttons
    function createSocialButton(label, pathData) {
        const btn = document.createElement('button');
        btn.className = 'techcloud-social-btn';
        btn.setAttribute('aria-label', `Login with ${label}`);
        btn.style.cssText = `
            width: 48px !important;
            height: 48px !important;
            border: 2px solid #E0E0E0 !important;
            border-radius: 8px !important;
            background: #FFFFFF !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            padding: 0 !important;
        `;
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'techcloud-social-icon');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');
        svg.style.cssText = `
            width: 24px !important;
            height: 24px !important;
            color: #757575 !important;
        `;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        svg.appendChild(path);
        btn.appendChild(svg);
        
        btn.addEventListener('mouseenter', function() {
            this.style.borderColor = '#0089FF';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.borderColor = '#E0E0E0';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        return btn;
    }
    
    // Run when DOM is ready
    function initLoginPage() {
        // Re-check after DOM is ready; if not login page, exit quietly.
        if (!isLoginPage()) {
            console.log("[Techcloud Login] Not a login page, exiting");
            return;
        }

        console.log("[Techcloud Login] Login page detected, starting restructure...");

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(restructureLoginPage, 100);
            });
        } else {
            setTimeout(restructureLoginPage, 100);
        }
        
        // Also run after delays to catch dynamic content
        setTimeout(function() {
            if (!document.querySelector('.techcloud-restructured')) {
                restructureLoginPage();
            }
        }, 500);
        
        setTimeout(function() {
            if (!document.querySelector('.techcloud-restructured')) {
                restructureLoginPage();
            }
        }, 1000);
    }
    
    // Start immediately
    // If body isn't ready, wait; otherwise run now.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLoginPage);
    } else {
        initLoginPage();
    }
    
    // Also listen for any DOM changes (in case Frappe loads content dynamically)
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            const loginSection = document.querySelector('.for-login');
            if (loginSection && !loginSection.classList.contains('techcloud-restructured')) {
                console.log("[Techcloud Login] DOM changed, attempting restructure...");
                restructureLoginPage();
            }
        });
        
        // document.body can be null if this script ran in <head>
        const observeTarget = document.body || document.documentElement;
        if (observeTarget) {
            observer.observe(observeTarget, {
                childList: true,
                subtree: true
            });
        }
    }
})();
