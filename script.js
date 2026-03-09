document.addEventListener('DOMContentLoaded', function() {
    const btnLight = document.getElementById('btn-light');
    const btnDark = document.getElementById('btn-dark');
    const body = document.body;
    const themeLight = document.getElementById('theme-light');
    const themeDark = document.getElementById('theme-dark');
    const scene = document.querySelector('.scene');
    const greetingText = document.getElementById('greeting-text');
    const sun = document.querySelector('.sun');
    const cloudsContainer = document.querySelector('.clouds-container');

    let isDarkMode = false;
    let sunTransitionStarted = false;

    // Text für Light und Dark Mode
    const textLightMode = "Ohne die <span class=\"diamond-highlight\">Dunkelheit</span>…";
    const textDarkMode = "Ohne die <span class=\"diamond-highlight\">Dunkelheit</span>…<br><br>… könnte man keine <span class=\"stars-highlight\">Sterne</span> sehen.";

    function switchToLightMode() {
        const wasDarkMode = isDarkMode;
        isDarkMode = false;
        body.classList.remove('darkmode');
        themeLight.disabled = false;
        themeDark.disabled = true;
        btnLight.style.transform = 'scale(1.15)';
        btnDark.style.transform = 'scale(1)';
        
        // Trigger Particle-Auffluganimation nur wenn man vom Dark Mode kommt
        if (wasDarkMode) {
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle) => {
                particle.classList.remove('light-mode-enter');
                // Reflow erzwingen
                void particle.offsetWidth;
                particle.classList.add('light-mode-enter');
                
                // Nach Animation normale Animation wiederherstellen
                setTimeout(() => {
                    particle.classList.remove('light-mode-enter');
                }, 2000);
            });
        }
        
        // Sonne zurück nach oben fahren
        sun.classList.remove('setting');
        sunTransitionStarted = false;
        
        // Text wechseln mit Fade-Out/Fade-In
        greetingText.style.opacity = '0';
        setTimeout(() => {
            greetingText.innerHTML = textLightMode;
            greetingText.style.opacity = '1';
        }, 400);
    }

    function switchToDarkMode() {
        isDarkMode = true;
        body.classList.add('darkmode');
        themeLight.disabled = true;
        themeDark.disabled = false;
        btnLight.style.transform = 'scale(1)';
        btnDark.style.transform = 'scale(1.15)';
        
        // Reset Particle Animationen für Dark Mode Feuerwerk
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle) => {
            particle.classList.remove('light-mode-enter');
        });
        
        // Sonne hinunterfahren
        setTimeout(() => {
            sun.classList.add('setting');
            sunTransitionStarted = true;
        }, 100);
        
        // Text wechseln mit Fade-Out/Fade-In
        greetingText.style.opacity = '0';
        setTimeout(() => {
            greetingText.innerHTML = textDarkMode;
            greetingText.style.opacity = '1';
        }, 400);
    }

    btnLight.addEventListener('click', switchToLightMode);
    btnDark.addEventListener('click', switchToDarkMode);

    // Charaktere zum Springen bringen beim Hover
    const figures = document.querySelectorAll('.figure');
    
    figures.forEach(figure => {
        figure.addEventListener('mouseenter', function() {
            // Animiere mit requestAnimationFrame
            let startTime = null;
            const duration = 600; // 0.6 Sekunden
            const self = this;
            
            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                let translateY;
                if (progress < 0.5) {
                    // Up
                    translateY = -40 * (progress * 2);
                } else {
                    // Down
                    translateY = -40 * (2 - progress * 2);
                }
                
                self.style.transform = `translateY(${translateY}px)`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    self.style.transform = 'translateY(0)';
                }
            };
            
            requestAnimationFrame(animate);
        });
    });

    // Die Meteore sind nur im Darkmode sichtbar
    // Sie werden über CSS mit animation-delay gesteuert

    window.addEventListener('resize', function() {
        // Optional: Anpassungen bei Bildschirmgröße
    });

    document.addEventListener('keydown', function(e) {
        // 'L' für Lightmode
        if (e.key.toLowerCase() === 'l') {
            switchToLightMode();
        }
        // 'D' für Darkmode
        if (e.key.toLowerCase() === 'd') {
            switchToDarkMode();
        }
    });
});
