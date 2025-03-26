export default {
  async fetchPage(page) {
    try {
      const response = await fetch(`data/${page}.json`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${page}:`, error);
      throw error;
    }
  }
};