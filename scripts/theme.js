const Theme = (function() {
    let currentTheme = 'light';

    function init() {
        loadTheme();
        document.querySelector('.theme-toggle').addEventListener('click', toggle);
    }

    function loadTheme() {
        currentTheme = localStorage.getItem('theme') || 'light';
        document.body.style.transition = 'none';
        document.body.classList.add(currentTheme + '-theme');
        setTimeout(() => {
            document.body.style.transition = '';
        }, 50);
    }

    function toggle() {
        document.body.style.transition = 'none';
        document.body.classList.remove(currentTheme + '-theme');
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.add(currentTheme + '-theme');
        localStorage.setItem('theme', currentTheme);
        setTimeout(() => {
            document.body.style.transition = '';
        }, 50);
    }

    return {
        init: init,
        current: function() {
            return currentTheme;
        }
    };
})();

// Явно указываем экспорт по умолчанию
export default Theme;