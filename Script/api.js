const API_KEY = "pub_5f9ab50c6f5d40e8bd1f8babd3472d19";

// Helper function to handle fetch errors
async function fetchNews(params = {}) {
    const url = new URL("https://newsdata.io/api/1/news");
    url.searchParams.append('apikey', API_KEY);
    // Default to English if not specified
    if (!params.language) {
        url.searchParams.append('language', 'en');
    }

    for (const [key, value] of Object.entries(params)) {
        if (value) {
            url.searchParams.append(key, value);
        }
    }

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.results && errorData.results.message) {
                    errorMessage = `API Error: ${errorData.results.message}`;
                } else if (errorData.message) {
                    errorMessage = `API Error: ${errorData.message}`;
                }
            } catch (e) {
                // Ignore JSON parse error
            }
            throw new Error(errorMessage);
        }
        const data = await response.json();

        // Normalize data to match NYT structure expected by the app
        if (data.results) {
            const normalizedResults = data.results.map(article => ({
                title: article.title,
                url: article.link,
                abstract: article.description || "No description available.",
                published_date: article.pubDate,
                section: article.category ? article.category[0] : 'general',
                multimedia: article.image_url ? [{ url: article.image_url, format: 'superJumbo', width: 800 }] : []
            }));
            return { results: normalizedResults };
        }

        return { results: [] };
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
}

// Fetch Top Stories (Home Page) mapping to 'top' category
async function fetchTopStories() {
    const data = await fetchNews({ category: 'top' });
    return data ? data.results : [];
}

// Fetch Breaking News
async function fetchBreakingNews(limit = 10) {
    const data = await fetchNews({ category: 'top' });
    return data ? data.results : [];
}

// Fetch International News (World section) mapping to 'world' category
async function fetchInternationalNews() {
    const data = await fetchNews({ category: 'world' });
    return data ? data.results : [];
}

export { fetchTopStories, fetchBreakingNews, fetchInternationalNews };
