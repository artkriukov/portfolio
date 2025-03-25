const Animator = {
    startTransition: function() {
        const content = document.querySelector('.content__body');
        content.style.opacity = '0';
        content.style.transform = 'scale(.98)';
        content.style.transition = 'none';
    },
    completeTransition: function() {
        setTimeout(function() {
            const content = document.querySelector('.content__body');
            content.style.transition = 'opacity 0.4s cubic-bezier(.28,.11,.32,1), transform 0.4s cubic-bezier(.28,.11,.32,1)';
            content.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }, 10);
    }
};

export default Animator;