document.addEventListener('DOMContentLoaded', function() {
    loadTrainingData();
});

function loadTrainingData() {
    fetch('Data/training.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Данные загружены:', data); // Логируем данные
            if (!data.courses) {
                throw new Error('Ключ "courses" отсутствует в JSON');
            }
            renderCourses(data.courses);
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            const coursesList = document.getElementById('courses-list');
            if (coursesList) {
                coursesList.innerHTML = `<p style="color: red;">Ошибка загрузки данных: ${error.message}</p>`;
            }
        });
}

function renderCourses(courses) {
    const coursesList = document.getElementById('courses-list');
    if (!coursesList) {
        console.error('Элемент courses-list не найден!');
        return;
    }

    coursesList.innerHTML = courses.map((course, index) => `
        <div class="course-item">
            <div class="course-icon">${course.icon || ''}</div>
            <div class="course-details">
                <h3 class="course-title">${course.title || 'Нет названия'}</h3>
                <p class="course-description">${course.description || 'Нет описания'}</p>
            </div>
        </div>
        ${index < courses.length - 1 ? '<div class="course-divider"></div>' : ''}
    `).join('');
}