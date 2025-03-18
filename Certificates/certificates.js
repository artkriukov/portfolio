document.addEventListener('DOMContentLoaded', () => {
    loadCertificatesData();
});

function loadCertificatesData() {
    fetch('https://raw.githubusercontent.com/artkriukov/portfolio/main/Data/certificates.json')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сети');
            return response.json();
        })
        .then(data => renderCertificates(data.certificates))
        .catch(error => {
            console.error('Ошибка загрузки сертификатов:', error);
            showErrorNotification();
        });
}

function renderCertificates(certificates) {
    const container = document.getElementById('certificates-list');
    if (!container) {
        console.error('Контейнер сертификатов не найден');
        return;
    }

    container.innerHTML = certificates.map(cert => `
        <div class="certificate-item" 
             data-image="${cert.image}" 
             data-id="${cert.id || ''}">
            <div class="certificate-icon">${cert.icon || '📜'}</div>
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

    initCertificatesInteractivity();
    initPopupControls();
}

function initCertificatesInteractivity() {
    document.querySelectorAll('.certificate-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.currentTarget.dataset.image) return;
            openPopup(e.currentTarget.dataset.image);
        });
    });
}

function initPopupControls() {
    const popup = document.getElementById('certificatePopup');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.popup-overlay');

    if (!popup || !closeBtn || !overlay) {
        console.error('Элементы попапа не найдены');
        return;
    }

    // Обработчики закрытия
    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePopup();
    });

    // Защита от закрытия при клике на контент
    document.querySelector('.popup-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function openPopup(imageUrl) {
    const popup = document.getElementById('certificatePopup');
    const imageElement = document.querySelector('.certificate-image');
    
    if (!popup || !imageElement) {
        console.error('Элементы попапа не найдены');
        return;
    }

    // Предзагрузка изображения
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/artkriukov/portfolio/main/${imageUrl}`;
    img.onload = () => {
        imageElement.src = imageUrl;
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    img.onerror = () => {
        console.error('Не удалось загрузить изображение:', imageUrl);
        showErrorNotification('Ошибка загрузки изображения');
    };
}

function closePopup() {
    const popup = document.getElementById('certificatePopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showErrorNotification(message = 'Ошибка загрузки данных') {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <span>⚠️</span>
        <p>${message}</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Экспорт для использования в других модулях
window.loadCertificatesData = loadCertificatesData;
window.openPopup = openPopup;
window.closePopup = closePopup;