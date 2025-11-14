// Netlify Function for getting offset suggestions for total emissions
const goldStandardService = require('../../services/goldStandardService');
const dataStore = require('../../services/dataStore');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const totalEmissions = dataStore.getTotalEmissions();
    const stats = dataStore.getStatistics();

    if (totalEmissions === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'No emissions tracked yet',
          data: {
            total_co2_kg: 0,
            total_co2_tons: 0,
            estimated_offset_cost: {
              amount: 0,
              currency: 'USD'
            }
          }
        })
      };
    }

    const offsetSuggestions = await goldStandardService.getOffsetSuggestions(totalEmissions);

    // If offset suggestions failed, provide mock data
    let offsetData = offsetSuggestions.data;
    if (!offsetData || !offsetSuggestions.success) {
      // Provide mock offset suggestions
      const offsetCost = goldStandardService.calculateOffsetCost(totalEmissions);
      offsetData = {
        estimated_offset_cost: {
          amount: offsetCost.total_cost.toFixed(2),
          currency: 'USD'
        },
        suggested_projects: [
          {
            name: 'Renewable Energy Project',
            type: 'Renewable Energy',
            location: 'Global',
            description: 'Support renewable energy projects to offset your carbon footprint.',
            price_per_ton: 15,
            certification: 'Gold Standard'
          },
          {
            name: 'Reforestation Project',
            type: 'Forestry',
            location: 'Global',
            description: 'Plant trees and restore forests to absorb CO₂ from the atmosphere.',
            price_per_ton: 12,
            certification: 'Gold Standard'
          },
          {
            name: 'Clean Water Project',
            type: 'Water',
            location: 'Global',
            description: 'Provide clean water access while reducing carbon emissions.',
            price_per_ton: 18,
            certification: 'Gold Standard'
          }
        ],
        recommendations: [
          'Consider offsetting your emissions through verified carbon offset projects',
          'Reduce your carbon footprint by choosing sustainable transportation options',
          'Support renewable energy sources in your daily life'
        ]
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        emissions_summary: {
          total_co2_kg: stats.total_emissions_kg,
          total_co2_tons: stats.total_emissions_tons,
          total_activities: stats.total_activities,
          by_activity: stats.by_activity
        },
        offset_suggestions: offsetData
      })
    };
  } catch (error) {
    console.error('Error getting offset suggestions:', error);
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

