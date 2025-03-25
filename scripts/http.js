// scripts/http.js
var Http = {
    fetchPage: function(page, callback) {
        fetch('data/' + page + '.json')
            .then(function(response) {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            })
            .then(callback)
            .catch(function(error) {
                console.error('Failed to load page:', error);
                document.querySelector('.content__body').innerHTML = `
                    <div class="error-card card">
                        <p>⚠️ Ошибка загрузки данных</p>
                    </div>
                `;
                Animator.completeTransition();
            });
    }
};