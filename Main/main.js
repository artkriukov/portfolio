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
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки ${page}.html: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                contentDiv.innerHTML = data;
    
                setTimeout(() => {  // Даем время браузеру вставить HTML
                    switch (page) {
                        case 'about':
                            if (window.loadAboutData) window.loadAboutData();
                            break;
                        case 'sidebar':
                            if (window.loadSidebarData) window.loadSidebarData();
                            break;
                        case 'portfolio':
                            if (window.loadPortfolioData) window.loadPortfolioData();
                            break;
                        case 'certificates':
                            if (window.loadCertificatesData) window.loadCertificatesData();
                            break;
                        case 'experience':
                            if (window.loadExperienceData) window.loadExperienceData();
                            break;
                    }
                }, 50);
            })
            .catch(error => console.error('Ошибка загрузки страницы:', error));
    }

    // Загружаем данные для Sidebar при первой загрузке
    if (window.loadSidebarData) {
        window.loadSidebarData();
    }

    // Загружаем данные для About при первой загрузке
    if (window.loadAboutData) {
        window.loadAboutData();
    }
    
    if (window.loadPortfolioData) {
        window.loadPortfolioData();
    }

    // Загружаем страницу About по умолчанию
    loadPage('about');
});