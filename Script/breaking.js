import { fetchBreakingNews } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const newsContainer = document.getElementById('breaking-news-grid');
    if (!newsContainer) return;

    newsContainer.innerHTML = '<p style="color:white; padding: 20px;">Loading real-time updates...</p>';

    let stories = [];
    try {
        stories = await fetchBreakingNews(24);
    } catch (error) {
        newsContainer.innerHTML = `
            <div style="color: red; padding: 20px; text-align: center;">
                <h2>Error Loading Breaking News</h2>
                <p>${error.message}</p>
            </div>`;
        return;
    }

    if (!stories || stories.length === 0) {
        newsContainer.innerHTML = '<p style="color:white; padding: 20px;">No breaking news available at the moment.</p>';
        return;
    }

    newsContainer.innerHTML = ''; // Clear loading

    stories.forEach(story => {
        // Newswire API multimedia structure is different
        // usually multimedia[0].url if available
        let imageUrl = 'https://placehold.co/600x400?text=News';
        if (story.multimedia && story.multimedia.length > 0) {
            // Find usually the medium or jumbo one
            const img = story.multimedia.find(m => m.width >= 400) || story.multimedia[0];
            imageUrl = img.url;
        }

        const date = new Date(story.published_date).toLocaleString();

        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${imageUrl}" alt="${story.title}" class="card-img">
            <div class="card-content">
                <span class="card-tag">${story.section.toUpperCase()}</span>
                <h3 class="card-title">${story.title}</h3>
                <p class="card-desc">${story.abstract}</p>
                <div class="card-meta">
                    <span>${date}</span>
                    <a href="${story.url}" target="_blank" class="card-link">Read More</a>
                </div>
            </div>
        `;
        newsContainer.appendChild(card);
    });
});
