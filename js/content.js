// Content pages JavaScript (Songs, Chords)

document.addEventListener('DOMContentLoaded', function() {
    setupFilterButtons();
    setupSearch();
});

function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.song-card, .chord-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter cards
            cards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    const cardFilter = card.getAttribute('data-difficulty') || card.getAttribute('data-type');
                    if (cardFilter === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.3s ease';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchSongs') || document.getElementById('searchChords');
    const cards = document.querySelectorAll('.song-card, .chord-card');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
