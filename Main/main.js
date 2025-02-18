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
    
                setTimeout(() => {
                    if (page === 'about' && window.loadAboutData) {
                        window.loadAboutData();
                    } else if (page === 'sidebar' && window.loadSidebarData) {
                        window.loadSidebarData();
                    } else if (page === 'portfolio' && window.loadPortfolioData) {
                        window.loadPortfolioData();
                    } else if (page === 'certificates' && window.loadCertificatesData) {
                        window.loadCertificatesData();
                    } else if (page === 'experience' && window.loadExperienceData) {
                        window.loadExperienceData();
                    }
                }, 100);
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