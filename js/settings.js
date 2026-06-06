// Settings JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    const tabs = document.querySelectorAll('.settings-tab');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all
            navItems.forEach(i => i.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            // Add active to clicked
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
});
