
import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  Clock, 
  Filter, 
  Star, 
  MoreVertical,
  Maximize2,
  X
} from 'lucide-react';
import { translations, Language } from '../translations';

interface AdminTutorialsViewProps {
  lang: Language;
}

interface Video {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  level: 'Beginner' | 'Advanced';
  views: number;
  isNew?: boolean;
}

export const AdminTutorialsView: React.FC<AdminTutorialsViewProps> = ({ lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  
  const t = translations[lang].tutorials;
  const isRTL = lang === 'ar';

  const categories = ['All', 'Onboarding', 'Finance', 'Legal', 'Platform'];

  const videos: Video[] = [
    {
      id: 'v1',
      title: 'Platform Overview: Getting Started',
      category: 'Onboarding',
      duration: '4:30',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      level: 'Beginner',
      views: 1204,
      isNew: true
    },
    {
      id: 'v2',
      title: 'Managing Client Documents',
      category: 'Platform',
      duration: '6:15',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      level: 'Advanced',
      views: 850
    },
    {
      id: 'v3',
      title: 'Fiscal Declarations Made Easy',
      category: 'Finance',
      duration: '8:45',
      thumbnail: 'https://images.unsplash.com/photo-1554224154-260327c00c40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      level: 'Advanced',
      views: 2100
    },
    {
      id: 'v4',
      title: 'Legal Compliance 101',
      category: 'Legal',
      duration: '5:20',
      thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      level: 'Beginner',
      views: 940
    }
  ];

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in relative pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        <p className="text-slate-500 mt-1">{t.subtitle}</p>
      </div>

      {/* Hero Featured Video */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-[300px] shadow-2xl group cursor-pointer" onClick={() => setPlayingVideo(videos[0])}>
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" 
          alt="Featured" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-3 inline-block">
            {t.featured}
          </span>
          <h2 className="text-3xl font-bold text-white mb-2">Mastering the Admin Portal: Full Course</h2>
          <div className="flex items-center gap-4 text-slate-300 text-sm">
             <span className="flex items-center gap-1"><Clock size={14} /> 12:45</span>
             <span>•</span>
             <span>Updated yesterday</span>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
           <Play size={24} className="text-white fill-white ml-1" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 sticky top-20 z-10 bg-slate-50/90 backdrop-blur-sm p-2 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat === 'All' ? t.allCategories : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
           <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
           <input 
             type="text" 
             placeholder={t.searchPlaceholder}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className={`w-full py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
           />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVideos.map(video => (
          <div key={video.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="relative h-40 overflow-hidden cursor-pointer" onClick={() => setPlayingVideo(video)}>
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {video.duration}
              </span>
              {video.isNew && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  NEW
                </span>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                   <Play size={16} className="text-slate-900 ml-0.5 fill-slate-900" />
                 </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  video.level === 'Beginner' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                }`}>
                  {video.level}
                </span>
                <button className="text-slate-300 hover:text-slate-600">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <h3 className="font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setPlayingVideo(video)}>
                {video.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
                 <span>{video.views} {t.watched}</span>
                 <span>{video.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
           <div className="w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10">
                 <h3 className="text-white font-bold text-lg">{playingVideo.title}</h3>
                 <button onClick={() => setPlayingVideo(null)} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                   <X size={24} />
                 </button>
              </div>
              
              <div className="aspect-video bg-slate-900 flex items-center justify-center relative group">
                 {/* Fake Video Player UI */}
                 <img src={playingVideo.thumbnail} className="w-full h-full object-cover opacity-50" />
                 <button className="absolute w-20 h-20 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105">
                    <Play size={32} className="text-white fill-white ml-1" />
                 </button>
                 
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                    <div className="h-full bg-blue-600 w-1/3"></div>
                 </div>
              </div>
              
              <div className="p-6 bg-slate-900 text-white">
                 <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xl mb-1">{playingVideo.title}</h4>
                      <p className="text-slate-400 text-sm">Published in {playingVideo.category} • {playingVideo.level} Level</p>
                    </div>
                    <button className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors">
                      Download Resources
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
