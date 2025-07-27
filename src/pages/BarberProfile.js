import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  MessageCircle, 
  Calendar,
  User,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import ContactModal from '../components/ContactModal';

const BarberProfile = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isClient } = useAuth();
  const [barber, setBarber] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchBarberProfile();
  }, [id]);

  const fetchBarberProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/barbers/${id}`);
      setBarber(response.data.barber);
      setPosts(response.data.posts);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching barber profile:', error);
      toast.error('Error al cargar el perfil del barbero');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const PostCard = ({ post }) => (
    <div className="card">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-dark-300 mb-3 leading-relaxed">
            {post.content}
          </p>
          
          {post.image_url && (
            <div className="mb-3">
              <img 
                src={post.image_url} 
                alt="Post content"
                className="w-full h-48 object-cover rounded-lg"
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-dark-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">💈</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Barbero no encontrado
          </h3>
          <p className="text-dark-400">
            El barbero que buscas no existe o ha sido eliminado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center">
              <div className="text-6xl">💈</div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {barber.name}
                </h1>
                
                <div className="flex items-center space-x-4 text-dark-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{barber.location}</span>
                  </div>
                  
                  {barber.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-primary-500" />
                      <span className="text-primary-500 font-medium">
                        {barber.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">
                      {stats.totalPosts || 0}
                    </div>
                    <div className="text-sm text-dark-400">Publicaciones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">
                      {stats.totalContacts || 0}
                    </div>
                    <div className="text-sm text-dark-400">Contactos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">
                      {barber.experience_years || 0}
                    </div>
                    <div className="text-sm text-dark-400">Años Exp.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">
                      {barber.price_range || 'N/A'}
                    </div>
                    <div className="text-sm text-dark-400">Precio</div>
                  </div>
                </div>

                {/* Services and Bio */}
                <div className="space-y-4">
                  {barber.services && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Servicios
                      </h3>
                      <p className="text-dark-300">
                        {barber.services}
                      </p>
                    </div>
                  )}

                  {barber.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Sobre mí
                      </h3>
                      <p className="text-dark-300 leading-relaxed">
                        {barber.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Button */}
              <div className="lg:ml-8 mt-6 lg:mt-0">
                {isAuthenticated && isClient ? (
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="btn-primary flex items-center space-x-2 w-full lg:w-auto justify-center"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Contactar</span>
                  </button>
                ) : !isAuthenticated ? (
                  <div className="text-center">
                    <p className="text-dark-400 mb-2">Inicia sesión para contactar</p>
                    <button className="btn-outline w-full lg:w-auto">
                      Iniciar Sesión
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">
          Trabajos Recientes
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💈</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay publicaciones aún
            </h3>
            <p className="text-dark-400">
              Este barbero aún no ha compartido sus trabajos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          barber={barber}
          onClose={() => setShowContactModal(false)}
          onSuccess={() => {
            setShowContactModal(false);
            fetchBarberProfile(); // Refresh stats
          }}
        />
      )}
    </div>
  );
};

export default BarberProfile; 