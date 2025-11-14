// Netlify Function for calculating emissions
const climatiqService = require('../../services/climatiqService');
const dataStore = require('../../services/dataStore');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { activity_type, ...activityData } = body;

    if (!activity_type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'activity_type is required'
        })
      };
    }

    let result;

    // Route to appropriate calculation method
    switch (activity_type) {
      case 'electricity':
        result = await climatiqService.calculateElectricity(activityData);
        break;
      
      case 'travel':
        result = await climatiqService.calculateTravel(activityData);
        break;
      
      case 'freight':
        result = await climatiqService.calculateFreight(activityData);
        break;
      
      case 'procurement':
        result = await climatiqService.calculateProcurement(activityData);
        break;
      
      case 'fuel':
        result = await climatiqService.calculateFuel(activityData);
        break;
      
      case 'custom':
        result = await climatiqService.calculateEmission(activityData);
        break;
      
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: `Unknown activity_type: ${activity_type}`
          })
        };
    }

    if (result.success) {
      // Store the emission data
      const emissionRecord = dataStore.addEmission({
        activity_type,
        input_data: activityData,
        co2_kg: result.data.co2e,
        co2_unit: result.data.co2e_unit,
        emission_factor: result.data.emission_factor,
        constituent_gases: result.data.constituent_gases
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Emission calculated successfully',
          record_id: emissionRecord.id,
          data: {
            co2e_kg: result.data.co2e,
            co2e_unit: result.data.co2e_unit,
            co2e_calculation_method: result.data.co2e_calculation_method,
            emission_factor: result.data.emission_factor,
            constituent_gases: result.data.constituent_gases,
            activity_data: result.data.activity_data
          }
        })
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: result.error
        })
      };
    }
  } catch (error) {
    console.error('Error calculating emissions:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

