// Configuration
const COUNTER_NAMESPACE = 'letter-box-xyz-adha-counter'; // Unique identifier
const COUNT_API_URL = `https://api.countapi.xyz/hit/${COUNTER_NAMESPACE}/visits`;

// Animate counting effect
function animateCount(current, target, element) {
    const increment = Math.ceil((target - current) / 10);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        element.textContent = String(current).padStart(3, '0');
    }, 50);
}

// Initialize counter
function initCounter() {
    const counterElement = document.getElementById('counter');
    
    // First show cached value if available
    const lastCount = localStorage.getItem('lastCount');
    if (lastCount) {
        counterElement.textContent = String(lastCount).padStart(3, '0');
    }
    
    // Get current count from API
    fetch(COUNT_API_URL)
        .then(response => response.json())
        .then(data => {
            const newCount = data.value;
            localStorage.setItem('lastCount', newCount);
            
            // Animate the count up
            const currentDisplay = parseInt(counterElement.textContent) || 0;
            animateCount(currentDisplay, newCount, counterElement);
            
            // Set up real-time updates (every 10 seconds)
            setInterval(() => {
                fetch(`https://api.countapi.xyz/get/${COUNTER_NAMESPACE}/visits`)
                    .then(response => response.json())
                    .then(data => {
                        const updatedCount = data.value;
                        if (updatedCount > newCount) {
                            animateCount(newCount, updatedCount, counterElement);
                        }
                    });
            }, 10000);
        })
        .catch(error => {
            console.error('Counter error:', error);
            counterElement.textContent = 'ERR';
            counterElement.style.color = '#f00';
        });
}

// Start the counter when page loads
window.addEventListener('DOMContentLoaded', initCounter);