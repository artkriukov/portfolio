window.loadCertificatesData = function () {
    const grid = document.getElementById('certificates-grid');

    if (!grid) {
        console.error("Ошибка: не найден элемент 'certificates-grid'");
        return;
    }

    fetch('Data/certificates.json')
        .then(response => response.json())
        .then(data => {
            if (!data.certificates || data.certificates.length === 0) {
                grid.innerHTML = "<p>Сертификатов пока нет.</p>";
                return;
            }

            grid.innerHTML = data.certificates.map(cert => `
                <div class="certificate-card">
                    <img src="${cert.image}" alt="${cert.title}" class="certificate-image">
                    <div class="certificate-info">
                        <h3>${cert.title}</h3>
                        <p class="certificate-org">${cert.organization}</p>
                        <p class="certificate-date">${cert.date}</p>
                        <a href="${cert.link}" target="_blank" class="certificate-link">Посмотреть</a>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => console.error('Ошибка загрузки сертификатов:', error));
};