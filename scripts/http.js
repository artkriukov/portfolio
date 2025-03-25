// scripts/http.js
var Http = {
    fetchPage: function(page, callback) {
        fetch('data/' + page + '.json')
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            })
            .then(data => {
                // Нормализация данных для about
                if (page === 'about' && data.description && !Array.isArray(data.description)) {
                    data.description = [data.description];
                }
                callback(data);
            })
            .catch(error => {
                console.error('Failed to load page:', error);
                callback({
                    name: '',
                    role: '',
                    description: ['Информация временно недоступна'],
                    socialLinks: []
                });
            });
    }
};