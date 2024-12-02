import { EventManager } from './EventManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const eventManager = new EventManager();
    const eventsContainer = document.querySelector('.events-container');

    eventsContainer.addEventListener('click', async (e) => {
        const heartBtn = e.target.closest('.heart-btn');
        if (heartBtn) {
            const eventRow = heartBtn.closest('.event-row');
            const title = eventRow.dataset.title; 

            if (!title) {
                console.error('Title not found for the event row');
                return;
            }

            const isUnliked = await eventManager.toggleLike(title); 
            if (isUnliked) {
                eventRow.style.opacity = '0';
                setTimeout(() => {
                    eventRow.remove(); 
                }, 300);
            }
        }
    });

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        const eventRows = document.querySelectorAll('.event-row');

        eventRows.forEach((row) => {
            const eventText = row.textContent.toLowerCase();
            const isVisible = eventText.includes(searchTerm.toLowerCase());

            row.style.display = isVisible ? 'flex' : 'none';
            row.style.opacity = isVisible ? '1' : '0';
        });
    });
});
