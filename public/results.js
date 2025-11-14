// API Base URL
const API_URL = '/api';

// Chart instances
let dailyChart = null;
let weeklyChart = null;
let activityChart = null;

// Initialize results page on load
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    loadStatistics();
    loadHistory();
    loadDailyData();
    loadWeeklyData();
    loadActivityData();
    loadOffsetSuggestions();
});

// Navigation functions
function goToDashboard() {
    window.location.href = '/dashboard.html';
}

function goToProfile() {
    window.location.href = '/profile.html';
}

// Load statistics
async function loadStatistics() {
    try {
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
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load history
async function loadHistory() {
    try {
        const response = await fetch(`${API_URL}/emissions/history`);
        const result = await response.json();
        
        if (result.success) {
            const historyDiv = document.getElementById('activityHistory');
            
            if (result.data.length === 0) {
                historyDiv.innerHTML = '<div class="empty-state"><p>No activities tracked yet. Add your first activity on the dashboard!</p></div>';
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

// Load daily data
async function loadDailyData() {
    try {
        const response = await fetch(`${API_URL}/emissions/daily?days=7`);
        const result = await response.json();
        
        if (result.success) {
            updateDailyChart(result.data);
        }
    } catch (error) {
        console.error('Error loading daily data:', error);
    }
}

// Load weekly data
async function loadWeeklyData() {
    try {
        const response = await fetch(`${API_URL}/emissions/weekly?weeks=4`);
        const result = await response.json();
        
        if (result.success) {
            updateWeeklyChart(result.data);
        }
    } catch (error) {
        console.error('Error loading weekly data:', error);
    }
}

// Load activity breakdown data
async function loadActivityData() {
    try {
        const response = await fetch(`${API_URL}/emissions/statistics`);
        const result = await response.json();
        
        if (result.success && result.data.by_activity) {
            updateActivityChart(result.data.by_activity);
        }
    } catch (error) {
        console.error('Error loading activity data:', error);
    }
}

// Load offset suggestions
async function loadOffsetSuggestions() {
    try {
        const response = await fetch(`${API_URL}/offsets/total`);
        const result = await response.json();
        
        if (result.success && result.emissions_summary.total_co2_kg > 0) {
            displayOffsetSuggestions(result);
        }
    } catch (error) {
        console.error('Error loading offset suggestions:', error);
    }
}

// Display offset suggestions
function displayOffsetSuggestions(data) {
    const offsetSection = document.getElementById('offsetSection');
    const offsetContent = document.getElementById('offsetContent');
    
    const summary = data.emissions_summary;
    const offsets = data.offset_suggestions;
    
    let html = `
        <div class="offset-summary">
            <h3>Your Total Emissions</h3>
            <p><strong>Total CO₂:</strong> ${summary.total_co2_kg.toFixed(2)} kg (${summary.total_co2_tons} tons)</p>
            <p><strong>Total Activities:</strong> ${summary.total_activities}</p>
            <p><strong>Estimated Offset Cost:</strong> $${offsets.estimated_offset_cost.amount} ${offsets.estimated_offset_cost.currency}</p>
        </div>
    `;
    
    if (offsets.recommendations) {
        html += '<div style="margin-top: 20px; padding: 15px; background: rgba(58, 74, 92, 0.2); border-radius: 8px; border: 1px solid rgba(58, 74, 92, 0.3);">';
        offsets.recommendations.forEach(rec => {
            html += `<p style="margin: 8px 0; color: var(--text-medium);">💡 ${rec}</p>`;
        });
        html += '</div>';
    }
    
    offsetContent.innerHTML = html;
    offsetSection.style.display = 'block';
}

// Initialize charts
function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#E8E8E8',
                    font: {
                        family: "'Inter', 'Nunito', system-ui, sans-serif"
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(42, 42, 58, 0.95)',
                titleColor: '#E8E8E8',
                bodyColor: '#E8E8E8',
                borderColor: 'rgba(58, 74, 92, 0.5)',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#B0B0B0'
                },
                grid: {
                    color: 'rgba(128, 128, 128, 0.1)'
                }
            },
            y: {
                ticks: {
                    color: '#B0B0B0'
                },
                grid: {
                    color: 'rgba(128, 128, 128, 0.1)'
                }
            }
        }
    };
    
    // Daily chart
    const dailyCtx = document.getElementById('dailyChart');
    if (dailyCtx) {
        dailyChart = new Chart(dailyCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'CO₂e (kg)',
                    data: [],
                    borderColor: 'rgba(139, 92, 246, 0.85)',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: 'rgba(139, 92, 246, 0.85)',
                    pointBorderColor: '#E8E8E8',
                    pointBorderWidth: 2
                }]
            },
            options: chartOptions
        });
    }
    
    // Weekly chart
    const weeklyCtx = document.getElementById('weeklyChart');
    if (weeklyCtx) {
        weeklyChart = new Chart(weeklyCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'CO₂e (kg)',
                    data: [],
                    backgroundColor: 'rgba(59, 130, 246, 0.85)'
                }]
            },
            options: chartOptions
        });
    }
    
    // Activity chart (Pie/Doughnut)
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        activityChart = new Chart(activityCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.85)',
                        'rgba(59, 130, 246, 0.85)',
                        'rgba(236, 72, 153, 0.85)',
                        'rgba(34, 197, 94, 0.85)',
                        'rgba(251, 146, 60, 0.85)'
                    ],
                    borderColor: 'rgba(42, 42, 58, 0.5)',
                    borderWidth: 2
                }]
            },
            options: {
                ...chartOptions,
                plugins: {
                    ...chartOptions.plugins,
                    legend: {
                        ...chartOptions.plugins.legend,
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Update daily chart
function updateDailyChart(data) {
    if (dailyChart && data && data.length > 0) {
        dailyChart.data.labels = data.map(d => formatDateShort(d.date));
        dailyChart.data.datasets[0].data = data.map(d => parseFloat(d.total_co2_kg.toFixed(2)));
        dailyChart.update();
    }
}

// Update weekly chart
function updateWeeklyChart(data) {
    if (weeklyChart && data && data.length > 0) {
        weeklyChart.data.labels = data.map(d => 
            `${formatDateShort(d.week_start)} - ${formatDateShort(d.week_end)}`
        );
        weeklyChart.data.datasets[0].data = data.map(d => parseFloat(d.total_co2_kg.toFixed(2)));
        weeklyChart.update();
    }
}

// Update activity chart
function updateActivityChart(data) {
    if (activityChart && data && data.length > 0) {
        activityChart.data.labels = data.map(d => d.activity_type);
        activityChart.data.datasets[0].data = data.map(d => parseFloat(d.total_co2_kg.toFixed(2)));
        activityChart.update();
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
    if (toast) {
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
}

