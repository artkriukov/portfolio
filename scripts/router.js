import Http from './http.js';
import Animator from './animator.js';
import Render from './render.js';
import Projects from './projects.js';
import Language from './lang.js';

const Router = (() => {
  let currentPage = null;
  const language = new Language();

  const navigate = async (page, forceReload = false) => {
    if (currentPage === page && !forceReload) return;
    Animator.startTransition();
    updateActiveTab(page);
    try {
      const data = await Http.fetchData();
      renderPage(page, data);
      currentPage = page;
      window.location.hash = page;
      document.dispatchEvent(new CustomEvent('pageChanged', { detail: { page, prevPage: currentPage } }));
    } catch (error) {
      showError(language.t('load_error'));
    }
  };

    const renderPage = async (page, data) => {
    const contentContainer = document.querySelector('.content-container');
    if (!contentContainer) return;
    contentContainer.style.opacity = '0';
    contentContainer.style.transform = 'translateY(10px)';
    contentContainer.style.transition = 'opacity 0.3s,transform 0.3s';
    await new Promise(resolve => setTimeout(resolve, 300));
    const title = language.t(page);
    const content = Render[page](data, language.getCurrentLang());
    contentContainer.innerHTML = `<h1 class="content-title">${title}</h1><div class="content__body">${content}</div>`;

    if (page === 'projects') {
        new Projects();
    }

    setTimeout(() => {
        contentContainer.style.opacity = '1';
        contentContainer.style.transform = 'translateY(0)';
    }, 50);
    };

  const updateActiveTab = (page) => {
    document.querySelectorAll('.navbar-tab,.mobile-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.content === page);
    });
  };

  const setupNavbarHandlers = () => {
    document.querySelectorAll('.navbar-tab,.mobile-tab').forEach(tab => {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        navigate(this.dataset.content);
      });
    });
  };

  const showError = (message) => {
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="error-message">
          <h1>${language.t('error')}</h1>
          <p>${message}</p>
          <button class="retry-button">${language.t('retry')}</button>
        </div>
      `;
      document.querySelector('.retry-button')?.addEventListener('click', () => {
        navigate(currentPage, true);
      });
    }
    Animator.completeTransition();
  };

  const setupLanguageHandlers = () => {
    document.addEventListener('languageChanged', () => {
      navigate(currentPage, true);
    });
  };

  const init = () => {
    setupNavbarHandlers();
    setupLanguageHandlers();
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.substring(1) || 'about';
      navigate(page);
    });
    const initialPage = window.location.hash.substring(1) || 'about';
    navigate(initialPage);
  };

  return { init, navigate };
})();

export default Router;
