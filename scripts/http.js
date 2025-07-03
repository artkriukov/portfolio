const Http = {
  async fetchData() {
    try {
      const response = await fetch('data/data.json');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error loading data.json:', error);
      throw error;
    }
  }
};

export default Http;
