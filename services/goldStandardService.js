const axios = require('axios');

class GoldStandardService {
  constructor() {
    this.apiKey = process.env.GOLD_STANDARD_API_KEY;
    this.baseUrl = process.env.GOLD_STANDARD_API_URL || 'https://api.goldstandard.org';
    
    if (!this.apiKey) {
      console.warn('⚠️  GOLD_STANDARD_API_KEY not found - offset suggestions will be limited');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get offset project suggestions based on CO2 emissions
   * @param {number} co2Amount - Amount of CO2 in kg
   * @returns {Promise<Object>} - Offset suggestions
   */
  async getOffsetSuggestions(co2Amount) {
    try {
      // Note: This is a placeholder implementation
      // Actual Gold Standard API endpoints may differ
      // You'll need to adjust based on their actual API documentation
      if (!this.apiKey) {
        return {
          success: false,
          error: 'GOLD_STANDARD_API_KEY not configured'
        };
      }

      const response = await this.client.get('/projects', {
        params: {
          co2_amount: co2Amount
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Gold Standard API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || { message: error.message }
      };
    }
  }

  /**
   * Mock offset suggestions (used when API key is not available)
   */
  

  /**
   * Calculate offset cost
   */
  calculateOffsetCost(co2Kg, pricePerTon = 15) {
    const co2Tons = co2Kg / 1000;
    return {
      co2_kg: co2Kg,
      co2_tons: co2Tons,
      price_per_ton: pricePerTon,
      total_cost: co2Tons * pricePerTon,
      currency: 'USD'
    };
  }

  /**
   * Get project details
   */
  async getProjectDetails(projectId) {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'API key not configured'
        };
      }

      const response = await this.client.get(`/projects/${projectId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Gold Standard API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || { message: error.message }
      };
    }
  }
}

module.exports = new GoldStandardService();

