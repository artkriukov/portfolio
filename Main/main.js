document.addEventListener('DOMContentLoaded', function() {
    const tapbarButtons = document.querySelectorAll('.tapbar button');
    const contentDiv = document.getElementById('content');

    // Функция для загрузки страницы
    function loadPage(page) {
        fetch(`${page}/${page}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка загрузки ${page}.html: ${response.statusText}`);
                return response.text();
            })
            .then(data => {
                contentDiv.innerHTML = data;


                
                // Добавляем обработчик события 'load' для вставленного HTML
                const insertedScripts = contentDiv.querySelectorAll('script');
                insertedScripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    document.body.appendChild(newScript).onload = () => {
                        // После загрузки скриптов вызываем соответствующие функции
                        switch(page) {
                            case 'experience':
                                if (window.loadExperienceData) window.loadExperienceData();
                                break;
                            case 'portfolio':
                                if (window.loadPortfolioData) window.loadPortfolioData();
                                break;
                            case 'certificates':
                                if (window.loadCertificatesData) window.loadCertificatesData();
                                break;
                        }
                    };
                });

                // Если скриптов нет, вызываем функции сразу
                if (insertedScripts.length === 0) {
                    switch(page) {
                        case 'experience':
                            if (window.loadExperienceData) window.loadExperienceData();
                            break;
                        case 'portfolio':
                            if (window.loadPortfolioData) window.loadPortfolioData();
                            break;
                        case 'certificates':
                            if (window.loadCertificatesData) window.loadCertificatesData();
                            break;
                    }
                }
            })
            .catch(error => console.error('Ошибка загрузки страницы:', error));
    }

    // Обработчики для кнопок тапбара
    tapbarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Загружаем страницу Experience по умолчанию
    loadPage('experience');
});