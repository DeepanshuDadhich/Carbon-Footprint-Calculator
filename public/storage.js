// Client-side storage for emissions data
// This persists data in the browser since Netlify Functions are stateless

class ClientStorage {
  constructor() {
    this.storageKey = 'carbon_footprint_emissions';
  }

  /**
   * Get all emissions from localStorage
   */
  getAllEmissions() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  /**
   * Add a new emission record
   */
  addEmission(emissionData) {
    const emissions = this.getAllEmissions();
    const record = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      ...emissionData
    };
    
    emissions.push(record);
    this.saveEmissions(emissions);
    return record;
  }

  /**
   * Save emissions to localStorage
   */
  saveEmissions(emissions) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(emissions));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Get total emissions
   */
  getTotalEmissions() {
    const emissions = this.getAllEmissions();
    return emissions.reduce((sum, emission) => sum + (emission.co2_kg || 0), 0);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const emissions = this.getAllEmissions();
    const total = this.getTotalEmissions();
    const count = emissions.length;
    const average = count > 0 ? total / count : 0;
    
    // Group by activity type
    const byActivity = {};
    emissions.forEach(emission => {
      const activity = emission.activity_type || 'other';
      if (!byActivity[activity]) {
        byActivity[activity] = {
          activity_type: activity,
          total_co2_kg: 0,
          count: 0
        };
      }
      byActivity[activity].total_co2_kg += emission.co2_kg || 0;
      byActivity[activity].count += 1;
    });

    // Get daily average
    const dates = [...new Set(emissions.map(e => e.date))];
    const dailyAverage = dates.length > 0 ? total / dates.length : 0;
    
    return {
      total_emissions_kg: total,
      total_emissions_tons: (total / 1000).toFixed(3),
      total_activities: count,
      average_per_activity_kg: average.toFixed(2),
      daily_average_kg: dailyAverage.toFixed(2),
      by_activity: Object.values(byActivity)
    };
  }

  /**
   * Get daily aggregated data
   */
  getDailyAggregated(days = 7) {
    const emissions = this.getAllEmissions();
    const dailyData = {};
    const today = new Date();
    
    // Initialize all days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        total_co2_kg: 0,
        count: 0
      };
    }
    
    // Aggregate emissions
    emissions.forEach(emission => {
      if (dailyData[emission.date]) {
        dailyData[emission.date].total_co2_kg += emission.co2_kg || 0;
        dailyData[emission.date].count += 1;
      }
    });
    
    return Object.values(dailyData);
  }

  /**
   * Get weekly aggregated data
   */
  getWeeklyAggregated(weeks = 4) {
    const emissions = this.getAllEmissions();
    const weeklyData = [];
    const today = new Date();
    
    for (let i = weeks - 1; i >= 0; i--) {
      const weekEnd = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStart = new Date(weekEnd.getTime() - 6 * 24 * 60 * 60 * 1000);
      
      const weekEmissions = emissions.filter(emission => {
        const emissionDate = new Date(emission.date);
        return emissionDate >= weekStart && emissionDate <= weekEnd;
      });
      
      const total = weekEmissions.reduce((sum, e) => sum + (e.co2_kg || 0), 0);
      
      weeklyData.push({
        week_start: weekStart.toISOString().split('T')[0],
        week_end: weekEnd.toISOString().split('T')[0],
        total_co2_kg: total,
        count: weekEmissions.length
      });
    }
    
    return weeklyData;
  }

  /**
   * Clear all data
   */
  clearAll() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `em_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
window.clientStorage = new ClientStorage();

