var Theme = (function() {
    var currentTheme = 'light';
    
    function init() {
        loadTheme();
        document.querySelector('.theme-toggle').addEventListener('click', toggle);
    }
    
    function loadTheme() {
        currentTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.add(currentTheme + '-theme');
    }
    
    function toggle() {
        document.body.classList.remove(currentTheme + '-theme');
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.add(currentTheme + '-theme');
        localStorage.setItem('theme', currentTheme);
    }
    
    return {
        init: init,
        current: function() { return currentTheme; }
    };
})();