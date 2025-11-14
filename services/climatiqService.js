const axios = require('axios');

class ClimatiqService {
  constructor() {
    this.apiKey = process.env.CLIMATIQ_API_KEY;
    this.baseUrl = process.env.CLIMATIQ_API_URL || 'https://api.climatiq.io';
    
    if (!this.apiKey) {
      console.warn('⚠️  CLIMATIQ_API_KEY not found in environment variables');
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
   * Calculate emissions for a specific activity
   * @param {Object} data - Emission calculation data
   * @returns {Promise<Object>} - Emission calculation result
   */
  async calculateEmission(data) {
    try {
      const response = await this.client.post('/data/v1/estimate', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Climatiq API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || { message: error.message }
      };
    }
  }

  /**
   * Search for emission factors
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} - Search results
   */
  async searchEmissionFactors(params) {
    try {
      const response = await this.client.get('/data/v1/search', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Climatiq Search Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || { message: error.message }
      };
    }
  }

  /**
   * Calculate electricity emissions
   */
  async calculateElectricity({ energy, energy_unit = 'kWh', region = 'US', year = 2021 }) {
    return this.calculateEmission({
      emission_factor: {
        activity_id: 'electricity-supply_grid-source_supplier_mix',
        data_version: '^27',
        region: region,
        year: year
      },
      parameters: {
        energy: parseFloat(energy),
        energy_unit: energy_unit
      }
    });
  }

  /**
   * Calculate travel emissions (car, plane, train)
   */
  async calculateTravel({ distance, distance_unit = 'km', vehicle_type, fuel_type, region, year = 2024 }) {
    const activityId = this.buildTravelActivityId(vehicle_type, fuel_type);
    
    // Build emission factor object
    const emissionFactor = {
      activity_id: activityId,
      data_version: '^27'
    };
    
    // Planes and trains don't typically use region/year parameters
    const noRegionTypes = ['plane', 'train'];
    const needsRegion = !noRegionTypes.includes(vehicle_type);
    
    // Only add region and year for vehicle types that support them
    if (region && needsRegion) {
      emissionFactor.region = region;
    }
    if (year && needsRegion) {
      emissionFactor.year = year;
    }
    
    return this.calculateEmission({
      emission_factor: emissionFactor,
      parameters: {
        distance: parseFloat(distance),
        distance_unit: distance_unit
      }
    });
  }

  /**
   * Calculate freight/shipping emissions
   */
  async calculateFreight({ weight, weight_unit = 'kg', distance, distance_unit = 'km', transport_mode = 'truck' }) {
    const activityId = this.buildFreightActivityId(transport_mode);
    
    return this.calculateEmission({
      emission_factor: {
        activity_id: activityId,
        data_version: '^27'
      },
      parameters: {
        weight: parseFloat(weight),
        weight_unit: weight_unit,
        distance: parseFloat(distance),
        distance_unit: distance_unit
      }
    });
  }

  /**
   * Calculate procurement/purchase emissions
   */
  async calculateProcurement({ money, money_unit = 'usd', category, region }) {
    // Try multiple activity ID formats - Climatiq has different formats
    const activityIdOptions = [
      category || 'consumer_goods-type_consumer_goods',
      'consumer_goods',
      'purchased_goods',
      'purchased_goods-type_consumer_goods'
    ];
    
    // Try without region first (most procurement activities don't support region)
    for (const activityId of activityIdOptions) {
      const emissionFactor = {
        activity_id: activityId,
        data_version: '^27'
      };
      
      // Try calculation without region
      let result = await this.calculateEmission({
        emission_factor: emissionFactor,
        parameters: {
          money: parseFloat(money),
          money_unit: money_unit
        }
      });
      
      // If successful, return
      if (result.success) {
        return result;
      }
      
      // If it fails and region was provided, try with region
      if (region) {
        emissionFactor.region = region;
        result = await this.calculateEmission({
          emission_factor: emissionFactor,
          parameters: {
            money: parseFloat(money),
            money_unit: money_unit
          }
        });
        
        if (result.success) {
          return result;
        }
      }
    }
    
    // If all attempts failed, return the last error
    const emissionFactor = {
      activity_id: activityIdOptions[0],
      data_version: '^27'
    };
    
    return await this.calculateEmission({
      emission_factor: emissionFactor,
      parameters: {
        money: parseFloat(money),
        money_unit: money_unit
      }
    });
  }

  /**
   * Calculate fuel consumption emissions
   */
  async calculateFuel({ volume, volume_unit = 'l', fuel_type = 'petrol' }) {
    return this.calculateEmission({
      emission_factor: {
        activity_id: `fuel-type_${fuel_type}`,
        data_version: '^27'
      },
      parameters: {
        volume: parseFloat(volume),
        volume_unit: volume_unit
      }
    });
  }

  /**
   * Helper method to build travel activity ID
   */
  buildTravelActivityId(vehicleType, fuelType) {
    const typeMap = {
      car: 'passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na',
      bus: 'passenger_vehicle-vehicle_type_bus-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na',
      train: 'passenger_train-route_type_national_rail',
      plane: 'passenger_flight-route_type_domestic-aircraft_type_na-distance_na-class_na-rf_included',
      motorcycle: 'passenger_vehicle-vehicle_type_motorbike-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na'
    };
    
    return typeMap[vehicleType] || typeMap.car;
  }

  /**
   * Helper method to build freight activity ID
   */
  buildFreightActivityId(transportMode) {
    const modeMap = {
      truck: 'freight_vehicle-vehicle_type_hgv_all_diesel-fuel_source_diesel',
      ship: 'sea_freight-vessel_type_general_cargo',
      plane: 'air_freight',
      train: 'rail_freight'
    };
    
    return modeMap[transportMode] || modeMap.truck;
  }

  /**
   * Batch calculate multiple emissions
   */
  async batchCalculate(emissionsArray) {
    const results = [];
    
    for (const emission of emissionsArray) {
      const result = await this.calculateEmission(emission);
      results.push(result);
    }
    
    return results;
  }
}

module.exports = new ClimatiqService();

