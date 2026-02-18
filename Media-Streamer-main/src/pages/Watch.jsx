// src/pages/Watch.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFromAPI } from '../utils/fetchFromAPI';

const Watch = () => {
    const { id } = useParams();
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideoDetails = async () => {
            setLoading(true);
            try {
                const data = await fetchFromAPI('dl', { 
                    id: id,
                    
                });
                console.log('Video Details:', data); 
                setVideoData(data);
            } catch (error) {
                console.error("Error fetching video details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchVideoDetails();
        }
    }, [id]);

    return (
        <div className="flex-1 p-8 text-white bg-emerald-slate-bg overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
                    <iframe
                        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                        title={videoData?.title || "Video player"}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="mt-6">
                    <h1 className="text-2xl font-bold mb-2">
                        {videoData?.title || `Watching Video`}
                    </h1>
                     <div className="text-emerald-text-secondary mt-2">
                        {videoData?.author?.title} • {videoData?.stats?.views ? `${Number(videoData.stats.views).toLocaleString()} views` : ''}
                    </div>
                     <p className="mt-4 text-gray-300">
                        {videoData?.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Watch;
