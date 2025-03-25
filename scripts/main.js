document.addEventListener('DOMContentLoaded', function() {
    // Инициализация модулей
    Theme.init();
    Router.init();
    
    // Загрузка начальной страницы
    Router.navigate('about');
});