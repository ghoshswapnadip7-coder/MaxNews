const API_KEY = "thJ8ZAu0XRY8MSCqGdxzi4k9vp9igv04nUDVPqKvWct7e0wY"; // Provided by user

// Helper function to handle fetch errors
async function fetchNews(endpoint, params = {}) {
    const url = new URL(`https://api.nytimes.com/svc/${endpoint}`);
    url.searchParams.append('api-key', API_KEY);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value);
    }

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                // NYT API often returns faults in a 'fault' object
                if (errorData.fault && errorData.fault.faultstring) {
                    errorMessage = `API Error: ${errorData.fault.faultstring}`;
                }
            } catch (e) {
                // Ignore JSON parse error for error response
            }
            throw new Error(errorMessage);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
}

// Fetch Top Stories (Home Page)
async function fetchTopStories(section = 'home') {
    // https://api.nytimes.com/svc/topstories/v2/{section}.json
    const data = await fetchNews(`topstories/v2/${section}.json`);
    return data ? data.results : [];
}

// Fetch Breaking News (Using Newswire API for latest/real-time)
async function fetchBreakingNews(limit = 20) {
    // https://api.nytimes.com/svc/news/v3/content/all/all.json
    const data = await fetchNews(`news/v3/content/all/all.json`, { limit });
    return data ? data.results : [];
}

// Fetch International News (World section)
async function fetchInternationalNews() {
    return fetchTopStories('world');
}

export { fetchTopStories, fetchBreakingNews, fetchInternationalNews };
