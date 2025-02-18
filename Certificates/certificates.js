function loadCertificatesData() {
    fetch('Data/certificates.json')
        .then(response => response.json())
        .then(data => renderCertificates(data.certificates))
        .catch(error => console.error('Ошибка загрузки сертификатов:', error));
}

function renderCertificates(certificates) {
    const container = document.getElementById('certificates-list');
    if (!container) {
        console.error('Элемент certificates-list не найден!');
        return;
    }

    container.innerHTML = certificates.map(cert => `
        <div class="certificate-item" data-image="${cert.image}">
            <div class="certificate-icon">${cert.icon}</div>
            <div class="certificate-info">
                <h3 class="certificate-title">${cert.title}</h3>
                <p class="certificate-organization">${cert.organization}</p>
                <p class="certificate-date">${cert.date}</p>
            </div>
            <svg class="arrow-icon" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
        </div>
    `).join('');

    // Добавляем обработчики кликов
    document.querySelectorAll('.certificate-item').forEach(item => {
        item.addEventListener('click', () => openPopup(item.dataset.image));
    });

    // Инициализация попапа
    initPopup();
}

function initPopup() {
    const popup = document.getElementById('certificatePopup');
    const closeBtn = popup?.querySelector('.close-btn');

    if (!popup || !closeBtn) {
        console.error('Элементы попапа не найдены!');
        return;
    }

    // Закрытие по крестику
    closeBtn.addEventListener('click', closePopup);

    // Закрытие по клику вне области
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    // Закрытие по клавише ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
}

function openPopup(imageUrl) {
    const popup = document.getElementById('certificatePopup');
    const img = popup?.querySelector('.certificate-image');

    if (!popup || !img) {
        console.error('Элементы попапа не найдены!');
        return;
    }

    // Заполняем изображение
    img.src = imageUrl;

    // Показываем попап
    popup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
}

function closePopup() {
    const popup = document.getElementById('certificatePopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = ''; // Возвращаем прокрутку страницы
    }
}

// Экспорт функции для использования в main.js
window.loadCertificatesData = loadCertificatesData;