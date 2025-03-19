document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');
  
    fetch('Sidebar/sidebar.html')
      .then(response => response.text())
      .then(data => {
        sidebar.innerHTML = data;
        return fetch('Data/sidebar.json');
      })
      .then(response => response.json())
      .then(data => {
        // Основная информация
        const nameEl = document.getElementById('name');
        const roleEl = document.getElementById('role');
  
        if (nameEl) nameEl.textContent = data.name;
        if (roleEl) roleEl.textContent = data.role;
  
        // Социальные ссылки
        const socialLinksContainer = document.getElementById('social-links');
        if (socialLinksContainer && data.socialLinks) {
          socialLinksContainer.innerHTML = '';
          data.socialLinks.forEach(link => {
            const socialLink = document.createElement('a');
            socialLink.href = link.url;
            socialLink.title = link.name;
            socialLink.target = "_blank";
            socialLink.innerHTML = link.icon;
            socialLinksContainer.appendChild(socialLink);
          });
        }
  
        // Секция "Обо мне"
        const aboutDescription = document.getElementById('about-description');
        if (data.about && aboutDescription) {
          aboutDescription.textContent = data.about.description;
        }
      })
      .catch(error => console.error('Ошибка загрузки:', error));
  });