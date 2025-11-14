// Netlify Function for getting weekly aggregated emissions
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
    const weeks = parseInt(event.queryStringParameters?.weeks) || 4;
    const weeklyData = dataStore.getWeeklyAggregated(weeks);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        period: `${weeks} weeks`,
        data: weeklyData
      })
    };
  } catch (error) {
    console.error('Error getting weekly data:', error);
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

