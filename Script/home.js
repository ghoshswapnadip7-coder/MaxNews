import { fetchTopStories } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const topNewsContainer = document.querySelector('.top-news-container');
    const otherNewsContainer = document.querySelector('.other-news-container');

    console.log("Home script loaded");

    let stories = [];
    try {
        stories = await fetchTopStories('home');
    } catch (error) {
        topNewsContainer.innerHTML = `
            <div style="color: red; padding: 20px; text-align: center;">
                <h2>Error Loading News</h2>
                <p>${error.message}</p>
                <p>Please check your API Key configuration.</p>
            </div>`;
        return;
    }

    if (!stories || stories.length === 0) {
        topNewsContainer.innerHTML = '<p>Unable to load news at this time.</p>';
        return;
    }

    // 1. Featured Story (First item)
    const featuredStory = stories[0];
    const topImage = featuredStory.multimedia ? featuredStory.multimedia.find(m => m.format === 'Super Jumbo') || featuredStory.multimedia[0] : null;
    const topImageUrl = topImage ? topImage.url : 'https://placehold.co/800x500?text=No+Image';

    const featuredHTML = `
        <div class="top-news-card">
            <img src="${topImageUrl}" alt="${featuredStory.title}" class="top-news-img">
            <div class="top-news-overlay">
                <span class="top-news-label">${featuredStory.section.toUpperCase()}</span>
                <h2 class="top-news-title">${featuredStory.title}</h2>
                <p class="top-news-desc">${featuredStory.abstract}</p>
                <a href="${featuredStory.url}" target="_blank"><button class="read-more-btn">Read Full Story</button></a>
            </div>
        </div>
    `;
    topNewsContainer.innerHTML = featuredHTML;

    // 2. Other News (Next 3 items)
    // We keep existing structure but populate dynamically.
    // Clear existing static "Other News" cards first, but keep the header/button if we want
    // Actually, let's rebuild the container content to match the design.

    let otherNewsHTML = `<div class="section-title">Other Headlines</div>`;

    const sideStories = stories.slice(1, 4); // Get next 3
    sideStories.forEach(story => {
        const sideImage = story.multimedia ? story.multimedia.find(m => m.format === 'threeByTwoSmallAt2X') || story.multimedia[0] : null;
        const sideImageUrl = sideImage ? sideImage.url : 'https://placehold.co/200x200?text=No+Image';

        // Format date simply
        const timeAgo = new Date(story.published_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        otherNewsHTML += `
            <a href="${story.url}" target="_blank" style="text-decoration: none; color: inherit;">
                <div class="side-news-card">
                    <img src="${sideImageUrl}" alt="${story.title}" class="side-news-thumb">
                    <div class="side-news-content">
                        <h4 class="side-news-headline">${story.title}</h4>
                        <span class="side-news-meta">${story.section} • ${timeAgo}</span>
                    </div>
                </div>
            </a>
        `;
    });

    otherNewsHTML += `<button class="view-all-btn" onclick="window.location.href='Breaking.html'">View All Breaking</button>`;
    otherNewsContainer.innerHTML = otherNewsHTML;
});
