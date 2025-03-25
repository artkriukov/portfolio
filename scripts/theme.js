class Theme {
    constructor() {
      this.themeToggle = document.querySelector('.theme-toggle');
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
      this.updateToggleIcon();
    }
  
    updateToggleIcon() {
      const icon = this.themeToggle.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
      }
    }
  
    setupEventListeners() {
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
      }
      
      // Инициализация иконки
      this.updateToggleIcon();
    }
  }
  
  export default new Theme();