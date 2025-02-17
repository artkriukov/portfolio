document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    fetch('Sidebar/sidebar.html')
        .then(response => response.text())
        .then(data => {
            sidebar.innerHTML = data;
        })
        .catch(error => console.error('Error loading sidebar:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    fetch('Data/sidebar.json')
        .then(response => response.json())
        .then(data => {
            // Вставляем имя и профессию
            document.getElementById('name').textContent = data.name;
            document.getElementById('role').textContent = data.role;

            // Вставляем контактную информацию
            document.getElementById('phone').textContent = `📱 ${data.phone}`;
            document.getElementById('email').textContent = `📧 ${data.email}`;
            document.getElementById('location').textContent = `📍 ${data.location}`;

            // Вставляем социальные ссылки
            const socialLinksContainer = document.getElementById('social-links');
            data.socialLinks.forEach(link => {
                const socialLink = document.createElement('a');
                socialLink.href = link.url;
                socialLink.target = "_blank";
                socialLink.innerHTML = link.icon; // Вставляем SVG-код
                socialLinksContainer.appendChild(socialLink);
            });
        })
        .catch(error => console.error('Error loading sidebar data:', error));
});