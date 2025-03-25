const Http = {
    fetchPage: async function(page) {
        try {
            const response = await fetch(`data/${page}.json`);
            if (!response.ok) throw new Error('Network error');
            return await response.json();
        } catch (error) {
            console.error('Failed to load page:', error);
            return {
                name: '',
                role: '',
                description: ['Информация временно недоступна'],
                socialLinks: []
            };
        }
    }
};

export default Http;