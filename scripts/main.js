import Theme from './theme.js';
import Router from './router.js';
import Projects from './projects.js';

function setupModalClose() {
    function closeModal() {
        document.querySelector('.modal-overlay').classList.remove('active');
        document.querySelector('.modal-container').classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.querySelector('.modal-container.active')) {
            closeModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    Router.init();
    setupModalClose();

    if (document.querySelector('.projects-section')) {
        new Projects();
    }
});