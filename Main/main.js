document.addEventListener('DOMContentLoaded', function() {
    const tapbarButtons = document.querySelectorAll('.tapbar button');
    const contentDiv = document.getElementById('content');

    function loadPage(page) {
        fetch(`${page}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка загрузки ${page}.html: ${response.statusText}`);
                return response.text();
            })
            .then(data => {
                contentDiv.innerHTML = data;
                const insertedScripts = contentDiv.querySelectorAll('script');
                insertedScripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    document.body.appendChild(newScript).onload = () => {
                        switch(page) {
                            case 'Experience/experience':
                                if (window.loadExperienceData) window.loadExperienceData();
                                break;
                            case 'Portfolio/portfolio':
                                if (window.loadPortfolioData) window.loadPortfolioData();
                                break;
                            case 'Certificates/certificates':
                                if (window.loadCertificatesData) window.loadCertificatesData();
                                break;
                        }
                    };
                });
                if (insertedScripts.length === 0) {
                    switch(page) {
                        case 'Experience/experience':
                            if (window.loadExperienceData) window.loadExperienceData();
                            break;
                        case 'Portfolio/portfolio':
                            if (window.loadPortfolioData) window.loadPortfolioData();
                            break;
                        case 'Certificates/certificates':
                            if (window.loadCertificatesData) window.loadCertificatesData();
                            break;
                    }
                }
            })
            .catch(error => console.error('Ошибка загрузки страницы:', error));
    }

    tapbarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Загружаем страницу Experience по умолчанию
    loadPage('Experience/experience');
});