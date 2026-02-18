import axios from 'axios';

const BASE_URL = 'https://yt-api.p.rapidapi.com';

const options = {
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
    'x-rapidapi-host': 'yt-api.p.rapidapi.com',
  }
};

export const fetchFromAPI = async (url, params = {}, retries = 3) => {
  try {
    const allParams = { geo: 'IN', ...params }; 
    const cacheKey = `youtube_api_${url}_${JSON.stringify(allParams)}`;
    
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (!parsed.msg || parsed.msg !== 'Refreshing Feed.') {
             console.log("Serving from cache:", url);
             return parsed;
        } else {
            localStorage.removeItem(cacheKey);
        }
    }

    const { data } = await axios.get(`${BASE_URL}/${url}`, {
      ...options,      
      params: allParams 
    });

    if (data?.msg === 'Refreshing Feed.' || data?.error === 'Retry') {
        if (retries > 0) {
            console.warn(`API is refreshing feed. Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            return fetchFromAPI(url, params, retries - 1);
        } else {
            throw new Error("API is busy refreshing. Please try again later.");
        }
    }

   
    if (data && !data.error && !data.msg) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
    }

    return data;

  } catch (error) {
    if (error.response?.status === 429) {
        console.error("API Rate Limit Exceeded.");
    }
    console.error("API Error:", error);
    throw error;
  }
};