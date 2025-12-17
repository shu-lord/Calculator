// ===================================
// MATRIX RAIN ANIMATION (UNIVERSAL)
// Works on all pages with #matrix-canvas
// ===================================

(function() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) {
        console.log('Matrix canvas not found on this page');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }

    // Initialize canvas size
    function resizeCanvas() {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth || window.innerWidth;
        canvas.height = parent.clientHeight || window.innerHeight;
    }
    
    resizeCanvas();

    // Matrix characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);

    // Array to hold drop positions
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }

    // Draw matrix rain
    function drawMatrix() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text style
        ctx.font = fontSize + 'px monospace';

        // Loop through drops
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = characters.charAt(Math.floor(Math.random() * characters.length));

            // Gradient color effect (red to orange)
            const gradient = ctx.createLinearGradient(0, drops[i] * fontSize, 0, (drops[i] + 1) * fontSize);
            gradient.addColorStop(0, '#ff0040');
            gradient.addColorStop(1, '#ff6b35');
            ctx.fillStyle = gradient;

            // Draw character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reset drop to top randomly
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Increment Y coordinate
            drops[i]++;
        }
    }

    // Start animation
    const matrixInterval = setInterval(drawMatrix, 50);

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        
        // Update columns array for matrix animation
        columns = Math.floor(canvas.width / fontSize);
        drops.length = 0;
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
    });

    console.log('Matrix animation initialized');
})();
