var Router = (function() {
    var currentPage = null;
    
    function init() {
        // Обработчики для кнопок в сайдбаре
        document.querySelectorAll('.sidebar__tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                navigate(this.dataset.content);
            });
        });
    }
    
    function navigate(page) {
        if (currentPage === page) return;
        
        Animator.startTransition();
        updateActiveTab(page);
        
        Http.fetchPage(page, function(data) {
            renderPage(page, data);
            Animator.completeTransition();
            currentPage = page;
        });
    }
    
    function updateActiveTab(page) {
        document.querySelectorAll('.sidebar__tab').forEach(function(tab) {
            tab.classList.toggle('active', tab.dataset.content === page);
        });
    }
    
    function renderPage(page, data) {
        document.querySelector('.content__title').textContent = getTitle(page);
        document.querySelector('.content__body').innerHTML = getRenderer(page)(data);
    }
    
    function getTitle(page) {
        var titles = {
            about: 'Обо мне',
            stack: 'Технологии',
            projects: 'Проекты',
            experience: 'Опыт работы'
        };
        return titles[page];
    }
    
    function getRenderer(page) {
        return Render[page];
    }

    return {
        init: init,
        navigate: navigate
    };
})();