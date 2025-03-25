var Animator = {
    startTransition: function() {
        var content = document.querySelector('.content__body');
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
    },
    
    completeTransition: function() {
        setTimeout(function() {
            var content = document.querySelector('.content__body');
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
            content.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        }, 10);
    }
};