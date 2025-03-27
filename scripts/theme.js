class Theme {
  constructor() {
    this.themeSwitcher = document.querySelector('.theme-switcher-track');
    this.currentTheme = localStorage.getItem('theme') || 'light';
  }

  init() {
    this.applyTheme();
    this.setupEventListeners();
  }

  applyTheme() {
    if (this.currentTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', this.currentTheme);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
  }

  setupEventListeners() {
    if (this.themeSwitcher) {
      this.themeSwitcher.addEventListener('click', () => this.toggleTheme());
    }
  }
}

export default new Theme();