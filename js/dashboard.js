// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});

function loadDashboardData() {
    // Simulate loading user data
    const userData = {
        xp: 2450,
        level: 12,
        streak: 42,
        achievements: 18
    };

    animateStats();
}

function animateStats() {
    const statCards = document.querySelectorAll('.stat-value');
    const values = ['2,450', '12', '42 days', '18'];

    statCards.forEach((card, index) => {
        let currentValue = 0;
        const targetValue = parseInt(values[index].replace(/[^\d]/g, ''));
        const increment = Math.ceil(targetValue / 20);

        const interval = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                card.textContent = values[index];
                clearInterval(interval);
            } else {
                card.textContent = currentValue.toLocaleString();
            }
        }, 30);
    });
}
