document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');

    // Загружаем HTML сайдбара
    fetch('Sidebar/sidebar.html')
        .then(response => response.text())
        .then(data => {
            sidebar.innerHTML = data;

            // После загрузки HTML загружаем JSON-данные
            return fetch('Data/sidebar.json');
        })
        .then(response => response.json())
        .then(data => {
            // Проверяем, что элементы существуют перед их обновлением
            const nameEl = document.getElementById('name');
            const roleEl = document.getElementById('role');
            const phoneEl = document.getElementById('phone');
            const emailEl = document.getElementById('email');
            const locationEl = document.getElementById('location');
            const socialLinksContainer = document.getElementById('social-links');

            if (nameEl) nameEl.textContent = data.name;
            if (roleEl) roleEl.textContent = data.role;
            if (phoneEl) phoneEl.textContent = `📱 ${data.phone}`;
            if (emailEl) emailEl.textContent = `✉️ ${data.email}`;
            if (locationEl) locationEl.textContent = `🌍 ${data.location}`;

            if (socialLinksContainer && data.socialLinks) {
                socialLinksContainer.innerHTML = ''; // Очищаем перед добавлением
                data.socialLinks.forEach(link => {
                    const socialLink = document.createElement('a');
                    socialLink.href = link.url;
                    socialLink.target = "_blank";
                    socialLink.innerHTML = link.icon;
                    socialLinksContainer.appendChild(socialLink);
                });
            }
        })
        .catch(error => console.error('Ошибка загрузки сайдбара:', error));
});