import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, MessageCircle, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset : 0;
      const response = await axios.get(`/api/posts?limit=10&offset=${currentOffset}`);
      
      if (loadMore) {
        setPosts(prev => [...prev, ...response.data.posts]);
      } else {
        setPosts(response.data.posts);
      }
      
      setHasMore(response.data.pagination.hasMore);
      setOffset(currentOffset + response.data.posts.length);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const PostCard = ({ post }) => (
    <div className="card animate-fade-in">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Link 
              to={`/barber/${post.user_id}`}
              className="font-semibold text-white hover:text-primary-500 transition-colors"
            >
              {post.user_name}
            </Link>
            <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full">
              {post.user_role}
            </span>
            {post.user_location && (
              <span className="text-sm text-dark-400">
                📍 {post.user_location}
              </span>
            )}
          </div>
          
          <p className="text-dark-300 mb-3 leading-relaxed">
            {post.content}
          </p>
          
          {post.image_url && (
            <div className="mb-4">
              <img 
                src={post.image_url} 
                alt="Post content"
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-dark-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{post.likes_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>0</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-dark-400">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Barber Community
        </h1>
        <p className="text-xl text-dark-300 max-w-2xl mx-auto">
          Descubre los mejores trabajos de barberos y mantente al día con las últimas tendencias
        </p>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💈</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay publicaciones aún
            </h3>
            <p className="text-dark-400">
              Sé el primero en compartir tu trabajo
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && posts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => fetchPosts(true)}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home; 