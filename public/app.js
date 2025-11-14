// API Base URL
const API_URL = '/api';

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    // Dashboard is now just for input - no statistics or history to load
});

// Update form fields based on selected activity type
function updateFormFields() {
    const activityType = document.getElementById('activityType').value;
    const dynamicFields = document.getElementById('dynamicFields');
    
    if (!activityType) {
        dynamicFields.innerHTML = '';
        return;
    }
    
    let html = '';
    
    switch (activityType) {
        case 'electricity':
            html = `
                <div class="form-group">
                    <label for="energy">Energy Amount:</label>
                    <input type="number" id="energy" placeholder="e.g., 100" required>
                </div>
                <div class="form-group">
                    <label for="energy_unit">Energy Unit:</label>
                    <select id="energy_unit">
                        <option value="kWh">kWh (Kilowatt-hour)</option>
                        <option value="MWh">MWh (Megawatt-hour)</option>
                        <option value="GJ">GJ (Gigajoule)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="region">Region:</label>
                    <select id="region">
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IN">India</option>
                        <option value="CN">China</option>
                        <option value="AU">Australia</option>
                        <option value="CA">Canada</option>
                    </select>
                </div>
                <div class="info-box">
                    💡 Enter your electricity consumption to calculate emissions from grid energy use.
                </div>
            `;
            break;
            
        case 'travel':
            html = `
                <div class="form-group">
                    <label for="distance">Distance:</label>
                    <input type="number" id="distance" placeholder="e.g., 50" required>
                </div>
                <div class="form-group">
                    <label for="distance_unit">Distance Unit:</label>
                    <select id="distance_unit">
                        <option value="km">Kilometers (km)</option>
                        <option value="mi">Miles (mi)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="vehicle_type">Vehicle Type:</label>
                    <select id="vehicle_type">
                        <option value="car">Car</option>
                        <option value="bus">Bus</option>
                        <option value="train">Train</option>
                        <option value="plane">Airplane</option>
                        <option value="motorcycle">Motorcycle</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fuel_type">Fuel Type (for cars):</label>
                    <select id="fuel_type">
                        <option value="petrol">Petrol/Gasoline</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>
                <div class="info-box">
                    🚗 Calculate emissions from your travel activities including commuting and trips.
                </div>
            `;
            break;
            
        case 'freight':
            html = `
                <div class="form-row">
                    <div class="form-group">
                        <label for="weight">Weight:</label>
                        <input type="number" id="weight" placeholder="e.g., 500" required>
                    </div>
                    <div class="form-group">
                        <label for="weight_unit">Weight Unit:</label>
                        <select id="weight_unit">
                            <option value="kg">Kilograms (kg)</option>
                            <option value="t">Metric Tons (t)</option>
                            <option value="lb">Pounds (lb)</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="distance">Distance:</label>
                        <input type="number" id="distance" placeholder="e.g., 1000" required>
                    </div>
                    <div class="form-group">
                        <label for="distance_unit">Distance Unit:</label>
                        <select id="distance_unit">
                            <option value="km">Kilometers (km)</option>
                            <option value="mi">Miles (mi)</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="transport_mode">Transport Mode:</label>
                    <select id="transport_mode">
                        <option value="truck">Truck</option>
                        <option value="ship">Ship</option>
                        <option value="plane">Airplane</option>
                        <option value="train">Train</option>
                    </select>
                </div>
                <div class="info-box">
                    📦 Calculate emissions from shipping and freight transportation.
                </div>
            `;
            break;
            
        case 'procurement':
            html = `
                <div class="form-group">
                    <label for="money">Amount Spent:</label>
                    <input type="number" id="money" placeholder="e.g., 500" required>
                </div>
                <div class="form-group">
                    <label for="money_unit">Currency:</label>
                    <select id="money_unit">
                        <option value="usd">USD ($)</option>
                        <option value="eur">EUR (€)</option>
                        <option value="gbp">GBP (£)</option>
                        <option value="inr">INR (₹)</option>
                        <option value="cny">CNY (¥)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="category">Purchase Category:</label>
                    <select id="category">
                        <option value="consumer_goods-type_consumer_goods">Consumer Goods</option>
                        <option value="food_and_beverages">Food & Beverages</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing & Textiles</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="region">Region:</label>
                    <select id="region">
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                    </select>
                </div>
                <div class="info-box">
                    🛒 Calculate emissions from purchases and procurement activities.
                </div>
            `;
            break;
            
        case 'fuel':
            html = `
                <div class="form-group">
                    <label for="volume">Fuel Volume:</label>
                    <input type="number" id="volume" placeholder="e.g., 50" required>
                </div>
                <div class="form-group">
                    <label for="volume_unit">Volume Unit:</label>
                    <select id="volume_unit">
                        <option value="l">Liters (L)</option>
                        <option value="gal">Gallons (gal)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fuel_type">Fuel Type:</label>
                    <select id="fuel_type">
                        <option value="petrol">Petrol/Gasoline</option>
                        <option value="diesel">Diesel</option>
                        <option value="natural_gas">Natural Gas</option>
                        <option value="lpg">LPG</option>
                    </select>
                </div>
                <div class="info-box">
                    ⛽ Calculate emissions from direct fuel consumption.
                </div>
            `;
            break;
    }
    
    dynamicFields.innerHTML = html;
}

// Navigation functions
function goToResults() {
    window.location.href = '/results.html';
}

// Reset form
function resetForm(showToastMessage = true) {
    document.getElementById('activityType').value = '';
    updateFormFields();
    if (showToastMessage) {
        showToast('Form reset successfully', 'success');
    }
}

// Calculate emission
async function calculateEmission(event) {
    const activityType = document.getElementById('activityType').value;
    
    if (!activityType) {
        showToast('Please select an activity type', 'error');
        return;
    }
    
    // Gather form data
    const formData = {
        activity_type: activityType
    };
    
    // Get all input and select elements in dynamic fields
    const dynamicFields = document.getElementById('dynamicFields');
    const inputs = dynamicFields.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        if (input.value) {
            formData[input.id] = input.value;
        }
    });
    
    // Validate required fields
    const requiredInputs = dynamicFields.querySelectorAll('input[required]');
    for (let input of requiredInputs) {
        if (!input.value) {
            showToast(`Please fill in ${input.previousElementSibling.textContent}`, 'error');
            return;
        }
    }
    
    // Get the button element
    const button = event ? event.target : document.querySelector('.btn-primary');
    if (!button) {
        showToast('❌ Button not found', 'error');
        return;
    }
    
    const originalText = button.textContent;
    
    try {
        // Show loading state
        button.disabled = true;
        button.classList.add('loading');
        button.textContent = 'Calculating...';
        
        const response = await fetch(`${API_URL}/emissions/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        // Re-enable button BEFORE doing anything else
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = originalText;
        
        if (result.success) {
            // Store emission in localStorage (Netlify Functions are stateless)
            if (window.clientStorage) {
                window.clientStorage.addEmission({
                    activity_type: activityType,
                    input_data: formData,
                    co2_kg: result.data.co2e_kg,
                    co2_unit: result.data.co2e_unit,
                    emission_factor: result.data.emission_factor,
                    constituent_gases: result.data.constituent_gases
                });
            }
            
            showToast(`✅ Emission calculated: ${result.data.co2e_kg.toFixed(2)} kg CO₂e`, 'success');
            
            // Reset form after successful calculation (without showing toast)
            resetForm(false);
            
            // Navigate to results page after a short delay
            setTimeout(() => {
                window.location.href = '/results.html';
            }, 1500);
        } else {
            // Show detailed error message
            const errorMsg = result.error.message || result.error || 'Calculation failed';
            showToast(`❌ Error: ${errorMsg}`, 'error');
            console.error('API Error:', result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Network error. Please check your connection.', 'error');
        
        // Re-enable button on error
        if (button) {
            button.disabled = false;
            button.classList.remove('loading');
            button.textContent = originalText;
        }
    }
}

// Load statistics
async function loadStatistics() {
    try {
        // Use localStorage if available (for Netlify Functions stateless issue)
        if (window.clientStorage) {
            const stats = window.clientStorage.getStatistics();
            document.getElementById('totalEmissions').textContent = 
                `${parseFloat(stats.total_emissions_kg).toFixed(2)} kg`;
            document.getElementById('totalActivities').textContent = stats.total_activities;
            document.getElementById('dailyAverage').textContent = 
                `${stats.daily_average_kg} kg`;
            
            // Calculate offset cost
            const offsetCost = (parseFloat(stats.total_emissions_kg) / 1000 * 15).toFixed(2);
            document.getElementById('offsetCost').textContent = `$${offsetCost}`;
            
            // Load activity chart
            if (stats.by_activity && stats.by_activity.length > 0) {
                loadActivityData();
            }
            return;
        }
        
        // Fallback to API
        const response = await fetch(`${API_URL}/emissions/statistics`);
        const result = await response.json();
        
        if (result.success) {
            const stats = result.data;
            document.getElementById('totalEmissions').textContent = 
                `${stats.total_emissions_kg.toFixed(2)} kg`;
            document.getElementById('totalActivities').textContent = stats.total_activities;
            document.getElementById('dailyAverage').textContent = 
                `${stats.daily_average_kg} kg`;
            
            // Calculate offset cost
            const offsetCost = (parseFloat(stats.total_emissions_kg) / 1000 * 15).toFixed(2);
            document.getElementById('offsetCost').textContent = `$${offsetCost}`;
            
            // Load activity chart
            if (stats.by_activity && stats.by_activity.length > 0) {
                loadActivityData();
            }
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load history
async function loadHistory() {
    try {
        // Use localStorage if available
        if (window.clientStorage) {
            const emissions = window.clientStorage.getAllEmissions();
            const historyDiv = document.getElementById('activityHistory');
            
            if (emissions.length === 0) {
                historyDiv.innerHTML = '<div class="empty-state"><p>No activities tracked yet. Add your first activity above!</p></div>';
                return;
            }
            
            // Show last 10 activities
            const recentActivities = emissions.slice(-10).reverse();
            
            historyDiv.innerHTML = recentActivities.map(activity => `
                <div class="activity-item">
                    <div class="activity-header">
                        <span class="activity-type">${getActivityIcon(activity.activity_type)} ${activity.activity_type}</span>
                        <span class="activity-co2">${activity.co2_kg.toFixed(2)} kg CO₂e</span>
                    </div>
                    <div class="activity-details">${formatActivityDetails(activity)}</div>
                    <div class="activity-date">${formatDate(activity.timestamp)}</div>
                </div>
            `).join('');
            return;
        }
        
        // Fallback to API
        const response = await fetch(`${API_URL}/emissions/history`);
        const result = await response.json();
        
        if (result.success) {
            const historyDiv = document.getElementById('activityHistory');
            
            if (result.data.length === 0) {
                historyDiv.innerHTML = '<div class="empty-state"><p>No activities tracked yet. Add your first activity above!</p></div>';
                return;
            }
            
            // Show last 10 activities
            const recentActivities = result.data.slice(-10).reverse();
            
            historyDiv.innerHTML = recentActivities.map(activity => `
                <div class="activity-item">
                    <div class="activity-header">
                        <span class="activity-type">${getActivityIcon(activity.activity_type)} ${activity.activity_type}</span>
                        <span class="activity-co2">${activity.co2_kg.toFixed(2)} kg CO₂e</span>
                    </div>
                    <div class="activity-details">${formatActivityDetails(activity)}</div>
                    <div class="activity-date">${formatDate(activity.timestamp)}</div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading history:', error);
    }
}


// Helper functions
function getActivityIcon(activityType) {
    const icons = {
        'electricity': '⚡',
        'travel': '🚗',
        'freight': '📦',
        'procurement': '🛒',
        'fuel': '⛽'
    };
    return icons[activityType] || '📊';
}

function formatActivityDetails(activity) {
    const input = activity.input_data;
    let details = [];
    
    if (input.energy) details.push(`${input.energy} ${input.energy_unit}`);
    if (input.distance) details.push(`${input.distance} ${input.distance_unit}`);
    if (input.weight) details.push(`${input.weight} ${input.weight_unit}`);
    if (input.money) details.push(`${input.money} ${input.money_unit}`);
    if (input.volume) details.push(`${input.volume} ${input.volume_unit}`);
    if (input.vehicle_type) details.push(`${input.vehicle_type}`);
    if (input.transport_mode) details.push(`${input.transport_mode}`);
    if (input.region) details.push(`Region: ${input.region}`);
    
    return details.join(' • ');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

