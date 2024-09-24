document.addEventListener("DOMContentLoaded", function () {
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    
    // Intersection Observer for Card Fade-in Animations
    const featureCards = document.querySelectorAll('.feature-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Stop observing once the animation is triggered
            }
        });
    }, {
        threshold: 0.1 // Start the animation when 10% of the element is in view
    });

    featureCards.forEach(card => {
        observer.observe(card);
    });


    
    // Info Button Functionality
    const infoButton = document.getElementById('info-button');
    const imageOverlay = document.getElementById('image-overlay');

    infoButton.addEventListener('click', function () {
        imageOverlay.style.display = 'flex'; // Show the overlay
    });

    // Close image overlay when clicking outside the image
    imageOverlay.addEventListener('click', function (e) {
        if (e.target === imageOverlay) {
            imageOverlay.style.display = 'none'; // Hide the overlay
        }
    });



    
    // Ensure the image overlay is hidden on page load
    imageOverlay.style.display = 'none';
});
