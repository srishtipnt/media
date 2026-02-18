import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFromAPI } from "../utils/fetchFromAPI";

const SearchFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchFromAPI(`search`, { query: searchTerm })
      .then((data) => {
          setVideos(data.data || []);
          setLoading(false);
      })
      .catch((err) => {
          console.error(err);
          setLoading(false);
      });
  }, [searchTerm]);

  if (loading) return <div className="text-white text-center py-20">Searching for {searchTerm}...</div>;

  if (!loading && (!videos || videos.length === 0)) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-900 p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">search_off</span>
          <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
          <p className="text-gray-400">Try different keywords or check your spelling</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-900 p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Search Results for: <span className="text-emerald-500">{searchTerm}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos?.map((item, idx) => {
            if (item.type !== 'video') return null;
            return (
                <div 
                    key={idx} 
                    className="group cursor-pointer"
                    onClick={() => navigate(`/watch/${item.videoId}`)}
                >
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
                        {item.thumbnail?.[0]?.url && (
                          <img 
                            alt={item.title} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                            src={item.thumbnail[0].url} 
                          />
                        )}
                        {(item.lengthText || item.lengthSeconds) && (
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                {item.lengthText || new Date(item.lengthSeconds * 1000).toISOString().substr(11, 8).replace(/^00:/, '')}
                            </div>
                        )}
                    </div>
                
                    <h3 className="text-white font-bold line-clamp-2 text-sm">{item.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">{item.channelTitle}</p>
                    <p className="text-gray-400 text-xs">
                        {item.viewCount && Number(item.viewCount).toLocaleString()} views • {item.publishedText}
                    </p>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default SearchFeed;
