import { fetchInternationalNews } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const newsContainer = document.getElementById('international-news-grid');
    if (!newsContainer) return;

    newsContainer.innerHTML = '<p style="color:white; padding: 20px;">Loading global headlines...</p>';

    const stories = await fetchInternationalNews();

    if (!stories || stories.length === 0) {
        newsContainer.innerHTML = '<p style="color:white; padding: 20px;">No international news available.</p>';
        return;
    }

    newsContainer.innerHTML = '';

    stories.forEach(story => {
        if (!story.title || !story.url) return; // Skip empty items

        const topImage = story.multimedia ? story.multimedia.find(m => m.format === 'superJumbo') || story.multimedia[0] : null;
        const imageUrl = topImage ? topImage.url : 'https://placehold.co/600x400?text=World+News';

        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${imageUrl}" alt="${story.title}" class="card-img">
            <div class="card-content">
                <span class="card-tag">WORLD</span>
                <h3 class="card-title">${story.title}</h3>
                <p class="card-desc">${story.abstract}</p>
                <a href="${story.url}" target="_blank" class="card-link">Read Full Report</a>
            </div>
        `;
        newsContainer.appendChild(card);
    });
});
