document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeIcon');
    themeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        // Toggle icon
        if (document.body.classList.contains('dark-theme')) {
            themeBtn.textContent = '☾'; // Sun for light mode
        } else {
            themeBtn.textContent = '☀'; // Moon for dark mode
        }
    });
});