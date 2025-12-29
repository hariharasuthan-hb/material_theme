// Techcloud Login Page Layout - Two Column Design
// Matches the structure from html/material_theme/techcloud-erp.html

(function () {
    "use strict";

    /* ============================================================
       GLOBAL HARD LOCK (prevents rerun forever)
    ============================================================ */
    if (window.__TECHCLOUD_LOGIN_DONE__) {
        return;
    }

    let observer = null;

    /* ============================================================
       UTIL: Safe selector
    ============================================================ */
    function $(selector, root = document) {
        return root.querySelector(selector);
    }

    /* ============================================================
       MAIN: Restructure login page ONCE to match HTML structure
    ============================================================ */
    function restructureLoginPage() {
        if (window.__TECHCLOUD_LOGIN_DONE__) {
            return true;
        }

        // Find Frappe's login sections
        const loginForm = $(".for-login");
        const signupForm = $(".for-signup");
        const forgotForm = $(".for-forgot");

        if (!loginForm) {
            return false;
        }

        // Find the container that holds login sections (usually .page-content or similar)
        const pageContent = $(".page-content") || document.body;
        if (!pageContent) {
            return false;
        }

        /* ---------- DISCONNECT OBSERVER IMMEDIATELY ---------- */
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        /* ---------- Create login-container (outer wrapper with gradient background) ---------- */
        const loginContainer = document.createElement("div");
        loginContainer.className = "login-container";
        loginContainer.id = "loginPage";
        loginContainer.style.cssText = `
            min-height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%) !important;
            padding: 20px !important;
        `;

        /* ---------- Create login-wrapper (inner white card with grid) ---------- */
        const loginWrapper = document.createElement("div");
        loginWrapper.className = "login-wrapper";
        loginWrapper.style.cssText = `
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            max-width: 1200px !important;
            width: 100% !important;
            background: #FFFFFF !important;
            border-radius: 16px !important;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16) !important;
            overflow: hidden !important;
        `;

        /* ---------- Create login-form-section (left column) ---------- */
        const loginFormSection = document.createElement("div");
        loginFormSection.className = "login-form-section";
        loginFormSection.style.cssText = `
            padding: 60px 50px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
        `;

        // Add logo
        const logo = document.createElement("div");
        logo.className = "logo";
        logo.textContent = "techcloud";
        logo.style.cssText = `
            font-size: 32px !important;
            font-weight: 700 !important;
            color: #0089FF !important;
            margin-bottom: 48px !important;
            letter-spacing: -0.8px !important;
            line-height: 1.2 !important;
        `;
        loginFormSection.appendChild(logo);

        // Add title
        const title = document.createElement("h1");
        title.className = "login-title";
        title.textContent = "Login to your account";
        title.style.cssText = `
            font-size: 36px !important;
            font-weight: 700 !important;
            margin-bottom: 8px !important;
            color: #212121 !important;
            line-height: 1.3 !important;
            letter-spacing: -0.5px !important;
        `;
        loginFormSection.appendChild(title);

        // Add subtitle
        const subtitle = document.createElement("p");
        subtitle.className = "login-subtitle";
        subtitle.textContent = "Welcome back! Please enter your details.";
        subtitle.style.cssText = `
            font-size: 16px !important;
            color: #757575 !important;
            margin-bottom: 48px !important;
            line-height: 1.6 !important;
        `;
        loginFormSection.appendChild(subtitle);

        // Create container for all auth forms
        const formsContainer = document.createElement("div");
        formsContainer.className = "techcloud-forms-container";
        formsContainer.style.cssText = `width: 100% !important;`;
        loginFormSection.appendChild(formsContainer);

        // Style and move login form into forms container
        if (loginForm) {
            loginForm.style.cssText = `
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            `;
            // Remove Frappe's header
            const loginHead = loginForm.querySelector(".page-card-head");
            if (loginHead) loginHead.remove();
            // Style login card
            const loginCard = loginForm.querySelector(".login-content.page-card");
            if (loginCard) {
                loginCard.style.cssText = `
                    width: 100% !important;
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                    margin: 0 !important;
                `;
            }
            formsContainer.appendChild(loginForm);
        }

        // Style and move signup form
        if (signupForm) {
            signupForm.style.cssText = `
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            `;
            const signupHead = signupForm.querySelector(".page-card-head");
            if (signupHead) signupHead.remove();
            const signupCard = signupForm.querySelector(".login-content.page-card");
            if (signupCard) {
                signupCard.style.cssText = `
                    width: 100% !important;
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                    margin: 0 !important;
                `;
            }
            formsContainer.appendChild(signupForm);
        }

        // Style and move forgot form
        if (forgotForm) {
            forgotForm.style.cssText = `
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            `;
            const forgotHead = forgotForm.querySelector(".page-card-head");
            if (forgotHead) forgotHead.remove();
            const forgotCard = forgotForm.querySelector(".login-content.page-card");
            if (forgotCard) {
                forgotCard.style.cssText = `
                    width: 100% !important;
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                    margin: 0 !important;
                `;
            }
            formsContainer.appendChild(forgotForm);
        }

        // Add signup link
        const signupLink = document.createElement("div");
        signupLink.className = "signup-link";
        signupLink.style.cssText = `
            text-align: center !important;
            margin-top: 30px !important;
            font-size: 14px !important;
            color: #757575 !important;
        `;
        signupLink.innerHTML = `Don't have an account? <a href="#signup" style="color: #0089FF; text-decoration: none; font-weight: 600;">Sign up</a>`;
        const signupAnchor = signupLink.querySelector("a");
        if (signupAnchor) {
            signupAnchor.addEventListener("click", function (e) {
                e.preventDefault();
                showSignupForm();
            });
        }
        loginFormSection.appendChild(signupLink);

        /* ---------- Create login-illustration-section (right column) ---------- */
        const loginIllustrationSection = document.createElement("div");
        loginIllustrationSection.className = "login-illustration-section";
        loginIllustrationSection.style.cssText = `
            background: linear-gradient(135deg, #0089FF 0%, #0066CC 100%) !important;
            padding: 60px 50px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            color: #FFFFFF !important;
            position: relative !important;
            overflow: hidden !important;
        `;

        const illustrationContent = document.createElement("div");
        illustrationContent.className = "illustration-content";
        illustrationContent.style.cssText = `text-align: center !important; z-index: 1 !important;`;

        const illustrationTitle = document.createElement("h2");
        illustrationTitle.className = "illustration-title";
        illustrationTitle.textContent = "Simplify your business with techcloud ERP";
        illustrationTitle.style.cssText = `
            font-size: 32px !important;
            font-weight: 700 !important;
            margin-bottom: 20px !important;
            color: #FFFFFF !important;
        `;
        illustrationContent.appendChild(illustrationTitle);

        const illustrationSubtitle = document.createElement("p");
        illustrationSubtitle.className = "illustration-subtitle";
        illustrationSubtitle.textContent = "Effortlessly manage your team and operations with our comprehensive ERP solution.";
        illustrationSubtitle.style.cssText = `
            font-size: 18px !important;
            opacity: 0.9 !important;
            line-height: 1.6 !important;
            color: #FFFFFF !important;
            margin-bottom: 40px !important;
        `;
        illustrationContent.appendChild(illustrationSubtitle);

        const illustrationGraphic = document.createElement("div");
        illustrationGraphic.className = "illustration-graphic";
        illustrationGraphic.style.cssText = `
            width: 100% !important;
            max-width: 400px !important;
            height: 300px !important;
            margin: 40px 0 !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
        `;

        // Add SVG illustration (matching HTML)
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "300");
        svg.setAttribute("height", "200");
        svg.setAttribute("viewBox", "0 0 300 200");
        svg.setAttribute("fill", "none");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        // Add circles
        const circles = [
            { cx: 150, cy: 100, r: 40 },
            { cx: 80, cy: 60, r: 25 },
            { cx: 220, cy: 60, r: 25 },
            { cx: 80, cy: 140, r: 25 },
            { cx: 220, cy: 140, r: 25 }
        ];

        circles.forEach(circle => {
            const circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circleEl.setAttribute("cx", circle.cx);
            circleEl.setAttribute("cy", circle.cy);
            circleEl.setAttribute("r", circle.r);
            circleEl.setAttribute("fill", circle.r === 40 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.25)");
            circleEl.setAttribute("stroke", "rgba(255,255,255,0.5)");
            circleEl.setAttribute("stroke-width", "2");
            svg.appendChild(circleEl);
        });

        // Add lines
        const lines = [
            { x1: 150, y1: 100, x2: 95, y2: 70 },
            { x1: 150, y1: 100, x2: 205, y2: 70 },
            { x1: 150, y1: 100, x2: 95, y2: 130 },
            { x1: 150, y1: 100, x2: 205, y2: 130 }
        ];

        lines.forEach(line => {
            const lineEl = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineEl.setAttribute("x1", line.x1);
            lineEl.setAttribute("y1", line.y1);
            lineEl.setAttribute("x2", line.x2);
            lineEl.setAttribute("y2", line.y2);
            lineEl.setAttribute("stroke", "rgba(255,255,255,0.4)");
            lineEl.setAttribute("stroke-width", "2");
            svg.appendChild(lineEl);
        });

        illustrationGraphic.appendChild(svg);
        illustrationContent.appendChild(illustrationGraphic);
        loginIllustrationSection.appendChild(illustrationContent);

        /* ---------- Assemble structure (matching HTML) ---------- */
        loginWrapper.appendChild(loginFormSection);
        loginWrapper.appendChild(loginIllustrationSection);
        loginContainer.appendChild(loginWrapper);

        /* ---------- Replace page content ---------- */
        // Clear pageContent safely
        const target = pageContent;
        while (target && target.firstChild) {
            target.removeChild(target.firstChild);
        }
        
        // Append login container
        if (target && target.nodeType === Node.ELEMENT_NODE) {
            target.appendChild(loginContainer);
        }

        /* ---------- Apply body styles ---------- */
        if (document.body) {
            document.body.style.setProperty("background", "transparent", "important");
            document.body.style.setProperty("margin", "0", "important");
            document.body.style.setProperty("padding", "0", "important");
            document.body.style.setProperty("box-sizing", "border-box", "important");
            document.body.style.setProperty("overflow-x", "hidden", "important");
        }

        /* ---------- Initial state ---------- */
        // Hide signup and forgot initially
        if (signupForm) {
            signupForm.style.setProperty("display", "none", "important");
        }
        if (forgotForm) {
            forgotForm.style.setProperty("display", "none", "important");
        }
        // Show login
        if (loginForm) {
            loginForm.style.setProperty("display", "block", "important");
        }

        /* ---------- Bind events ---------- */
        setupFormSwitching();

        /* ---------- Store references ---------- */
        window.techcloudLoginWrapper = loginWrapper;
        window.techcloudFormSection = loginFormSection;
        window.techcloudFormsContainer = formsContainer;

        /* ---------- HARD LOCK ---------- */
        window.__TECHCLOUD_LOGIN_DONE__ = true;

        return true;
    }

    /* ============================================================
       FORM VISIBILITY CONTROLS
    ============================================================ */
    function hideAllForms() {
        const forms = document.querySelectorAll(".for-login, .for-signup, .for-forgot");
        forms.forEach(el => {
            if (el) {
                el.style.setProperty("display", "none", "important");
            }
        });
    }

    function showLogin() {
        hideAllForms();
        const el = $(".for-login");
        if (el) {
            el.style.setProperty("display", "block", "important");
        }
        // Update title and subtitle
        const title = $(".login-title");
        const subtitle = $(".login-subtitle");
        if (title) title.textContent = "Login to your account";
        if (subtitle) subtitle.textContent = "Welcome back! Please enter your details.";
        // Show signup link
        const signupLink = $(".signup-link");
        if (signupLink) signupLink.style.display = "block";
        // Hide back link
        const backLink = $(".back-to-login");
        if (backLink) backLink.style.display = "none";
    }

    function showSignupForm() {
        hideAllForms();
        const el = $(".for-signup");
        if (el) {
            el.style.setProperty("display", "block", "important");
        }
        // Update title and subtitle
        const title = $(".login-title");
        const subtitle = $(".login-subtitle");
        if (title) title.textContent = "Create your account";
        if (subtitle) subtitle.textContent = "Get started by creating your account.";
        // Hide signup link, show back link
        const signupLink = $(".signup-link");
        if (signupLink) signupLink.style.display = "none";
        let backLink = $(".back-to-login");
        if (!backLink && window.techcloudFormSection) {
            backLink = document.createElement("div");
            backLink.className = "back-to-login";
            backLink.style.cssText = `
                text-align: center !important;
                margin-top: 20px !important;
                font-size: 14px !important;
                color: #757575 !important;
            `;
            backLink.innerHTML = `Already have an account? <a href="#login" style="color: #0089FF; text-decoration: none; font-weight: 600;">Log in</a>`;
            const loginAnchor = backLink.querySelector("a");
            if (loginAnchor) {
                loginAnchor.addEventListener("click", function (e) {
                    e.preventDefault();
                    showLogin();
                });
            }
            window.techcloudFormSection.appendChild(backLink);
        }
        if (backLink) backLink.style.display = "block";
    }

    function showForgot() {
        hideAllForms();
        const el = $(".for-forgot");
        if (el) {
            el.style.setProperty("display", "block", "important");
        }
        // Update title and subtitle
        const title = $(".login-title");
        const subtitle = $(".login-subtitle");
        if (title) title.textContent = "FORGOT PASSWORD";
        if (subtitle) subtitle.textContent = "Enter your email to reset your password.";
        // Hide signup link, show back link
        const signupLink = $(".signup-link");
        if (signupLink) signupLink.style.display = "none";
        let backLink = $(".back-to-login");
        if (!backLink && window.techcloudFormSection) {
            backLink = document.createElement("div");
            backLink.className = "back-to-login";
            backLink.style.cssText = `
                text-align: center !important;
                margin-top: 20px !important;
                font-size: 14px !important;
                color: #757575 !important;
            `;
            backLink.innerHTML = `Remember your password? <a href="#login" style="color: #0089FF; text-decoration: none; font-weight: 600;">Log in</a>`;
            const loginAnchor = backLink.querySelector("a");
            if (loginAnchor) {
                loginAnchor.addEventListener("click", function (e) {
                    e.preventDefault();
                    showLogin();
                });
            }
            window.techcloudFormSection.appendChild(backLink);
        }
        if (backLink) backLink.style.display = "block";
    }

    /* ============================================================
       EVENT BINDINGS
    ============================================================ */
    function setupFormSwitching() {
        // Intercept all auth link clicks
        document.addEventListener("click", function (e) {
            const signupLink = e.target.closest('a[href="#signup"], a[href*="#signup"]');
            if (signupLink && window.techcloudFormSection) {
                e.preventDefault();
                e.stopPropagation();
                showSignupForm();
            }

            const loginLink = e.target.closest('a[href="#login"], a[href*="#login"]');
            if (loginLink && window.techcloudFormSection && !loginLink.closest(".signup-link")) {
                e.preventDefault();
                e.stopPropagation();
                showLogin();
            }

            const forgotLink = e.target.closest('a[href="#forgot"], a[href*="#forgot"], .forgot-password-message a');
            if (forgotLink && window.techcloudFormSection) {
                e.preventDefault();
                e.stopPropagation();
                showForgot();
            }
        }, true);

        // Listen for hash changes
        window.addEventListener("hashchange", function () {
            const hash = window.location.hash;
            if (hash === "#signup" && window.techcloudFormSection) {
                showSignupForm();
            } else if (hash === "#forgot" && window.techcloudFormSection) {
                showForgot();
            } else if ((hash === "#login" || hash === "") && window.techcloudFormSection) {
                showLogin();
            }
        });

        // Check initial hash
        const initialHash = window.location.hash;
        if (initialHash === "#signup") {
            setTimeout(showSignupForm, 200);
        } else if (initialHash === "#forgot") {
            setTimeout(showForgot, 200);
        }
    }

    /* ============================================================
       OBSERVER (runs ONLY until first success)
    ============================================================ */
    function setupObserver() {
        // Wait for body to exist
        if (!document.body) {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", setupObserver);
            } else {
                setTimeout(setupObserver, 100);
            }
            return;
        }

        observer = new MutationObserver(() => {
            if (window.__TECHCLOUD_LOGIN_DONE__) {
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
                return;
            }
            restructureLoginPage();
        });

        // Only observe if body exists and is a valid Node
        const observeTarget = document.body || document.documentElement;
        if (observeTarget && observeTarget.nodeType === Node.ELEMENT_NODE) {
            observer.observe(observeTarget, {
                childList: true,
                subtree: true
            });
        }
    }

    setupObserver();

    /* ============================================================
       FALLBACK
    ============================================================ */
    setTimeout(restructureLoginPage, 300);

})();
