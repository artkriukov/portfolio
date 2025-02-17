document.addEventListener('DOMContentLoaded', function() {
    const tapbarButtons = document.querySelectorAll('.tapbar button');
    const contentDiv = document.getElementById('content');

    tapbarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });

    function loadPage(page) {
        fetch(`${page}/${page}.html`)
            .then(response => response.text())
            .then(data => {
                contentDiv.innerHTML = data;

                // Загружаем данные для страницы
                if (page === 'about') {
                    if (window.loadAboutData) {
                        window.loadAboutData();
                    }
                } else if (page === 'sidebar') {
                    if (window.loadSidebarData) {
                        window.loadSidebarData();
                    }
                }
            })
            .catch(error => console.error('Error loading page:', error));
    }

    // Загружаем данные для Sidebar при первой загрузке
    if (window.loadSidebarData) {
        window.loadSidebarData();
    }

    // Загружаем данные для About при первой загрузке
    if (window.loadAboutData) {
        window.loadAboutData();
    }

    // Загружаем страницу About по умолчанию
    loadPage('about');
});