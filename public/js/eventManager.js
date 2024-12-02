export class EventManager {
    /**
     * Toggles the like status of an event using the title as the unique identifier.
     * @param {string} title - The unique title of the event.
     * @returns {boolean} - Returns true if the event was unliked, false if liked or on error.
     */
    async toggleLike(title) {
        if (!title) {
            console.error('Title is required to toggle like.');
            return false;
        }

        try {
            const eventDetails = this.getEventDetails(title);
            
     
            console.log('Event details:', eventDetails);

            if (!eventDetails) {
                console.error(`Event details not found for title: ${title}`);
                return false;
            }

            const response = await fetch('/toggle-like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title, 
                    eventDetails, 
                }),
            });

            if (!response.ok) {
                console.error(`Failed to toggle like. Server responded with status: ${response.status}`);
                return false;
            }

            const data = await response.json();
            console.log('Response from server:', data); 
            return data.status === 'unliked'; 
        } catch (error) {
            console.error('Error toggling like:', error);
            return false;
        }
    }

    /**
     * Extracts event details from the DOM using the event's title.
     * @param {string} title - The unique title of the event.
     * @returns {object|null} - Event details or null if not found.
     */
    getEventDetails(title) {

        const eventRow = document.querySelector(`[data-title="${title}"]`);

        if (!eventRow) {
            console.error(`No event row found for title: ${title}`);
            return null;
        }

        try {
            return {
                image: eventRow.querySelector('img')?.src || '',
                title: eventRow.querySelector('img')?.alt || title,
                venue: eventRow.querySelector('.venue')?.textContent.trim() || 'Unknown Venue',
                date: eventRow.querySelector('.date')?.textContent.trim() || 'Unknown Date',
                time: eventRow.querySelector('.time')?.textContent.trim() || 'Unknown Time',
            };
        } catch (error) {
            console.error('Error extracting event details:', error);
            return null;
        }
    }
}
