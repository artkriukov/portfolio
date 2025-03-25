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
        var content = document.querySelector('.content__body');
        content.style.animation = 'none'; // Сброс анимации
        content.offsetHeight; // Trigger reflow
        
        document.querySelector('.content__title').textContent = getTitle(page);
        content.innerHTML = getRenderer(page)(data);
        
        // Добавляем класс с анимацией Apple
        content.classList.add('apple-transition');
        
        // Удаляем класс после завершения анимации
        setTimeout(() => {
            content.classList.remove('apple-transition');
        }, 400);
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