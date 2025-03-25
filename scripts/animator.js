var Animator = {
    startTransition: function() {
        var content = document.querySelector('.content__body');
        content.style.opacity = '0';
        content.style.transform = 'scale(0.98)';
        content.style.transition = 'none'; 
    },
    
    completeTransition: function() {
        setTimeout(function() {
            var content = document.querySelector('.content__body');
            content.style.transition = 'opacity 0.4s cubic-bezier(0.28, 0.11, 0.32, 1), transform 0.4s cubic-bezier(0.28, 0.11, 0.32, 1)';
            content.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }, 10);
    }
};