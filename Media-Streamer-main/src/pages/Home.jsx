import React, { useEffect, useState } from 'react';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { useNavigate } from 'react-router-dom'; 

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getVideos = async () => {
            setLoading(true);
            try {
                // Fetch videos
                const data = await fetchFromAPI('hype');
                console.log('Home Videos:', data);
                setVideos(data?.data || []);
                
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        getVideos();
    }, []);

    const formatTime = (seconds) => {
        if (!seconds) return "00:00"; 
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        
        const hDisplay = h > 0 ? `${h}:` : "";
        const mDisplay = h > 0 ? `${m < 10 ? '0' : ''}${m}:` : `${m}:`;
        const sDisplay = `${s < 10 ? '0' : ''}${s}`;
        
        return hDisplay + mDisplay + sDisplay;
    };

    const formatViews = (views) => {
        if (!views) return '0 views';
        const numViews = Number(views); 
        if (numViews >= 1000000) return `${(numViews / 1000000).toFixed(1)}M views`;
        if (numViews >= 1000) return `${(numViews / 1000).toFixed(1)}K views`;
        return `${numViews} views`;
    };

    return (
        <main className="flex-1 overflow-y-auto bg-slate-900 p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Home Videos</h2>
            
            {loading ? (
                <div className="text-white text-center py-20">Loading videos...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((item, index) => {
            
                        if (item.type !== 'video') return null;

                        return (
                            <div 
                                key={item.videoId || index} 
                                className="group cursor-pointer"
                                onClick={() => navigate(`/watch/${item.videoId}`)}
                            >
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
                                    <img 
                                        alt={item.title} 
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                                        src={item.thumbnail?.[0]?.url} 
                                    />
                                    {item.lengthSeconds && (
                                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                            {formatTime(item.lengthSeconds)}
                                        </div>
                                    )}
                                </div>
                                
                                <h3 className="text-white font-bold line-clamp-2 text-sm">{item.title}</h3>
                                <p className="text-gray-400 text-xs mt-1">{item.channelTitle}</p>
                                <p className="text-gray-400 text-xs">
                                    {formatViews(item.viewCount)} • {item.publishedText}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
};

export default Home;