import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const Explore = () => {
  const [barbers, setBarbers] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchBarbers();
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchBarbersByCity(selectedCity);
    }
  }, [selectedCity]);

  const fetchBarbers = async (loadMore = false) => {
    try {
      setLoading(true);
      const currentOffset = loadMore ? offset : 0;
      const response = await axios.get(`/api/barbers?limit=12&offset=${currentOffset}`);
      
      if (loadMore) {
        setBarbers(prev => [...prev, ...response.data.barbers]);
      } else {
        setBarbers(response.data.barbers);
      }
      
      setHasMore(response.data.pagination.hasMore);
      setOffset(currentOffset + response.data.barbers.length);
    } catch (error) {
      console.error('Error fetching barbers:', error);
      toast.error('Error al cargar los barberos');
    } finally {
      setLoading(false);
    }
  };

  const fetchBarbersByCity = async (city) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/barbers/search?city=${city}&limit=20`);
      setBarbers(response.data.barbers);
      setHasMore(false);
      setOffset(response.data.barbers.length);
    } catch (error) {
      console.error('Error fetching barbers by city:', error);
      toast.error('Error al buscar barberos por ciudad');
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get('/api/barbers/cities/list');
      setCities(response.data.cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setSelectedCity(searchCity.trim());
    }
  };

  const clearFilters = () => {
    setSelectedCity('');
    setSearchCity('');
    setOffset(0);
    fetchBarbers();
  };

  const BarberCard = ({ barber }) => (
    <Link 
      to={`/barber/${barber.id}`}
      className="card-hover group"
    >
      <div className="relative">
        {/* Profile Image Placeholder */}
        <div className="w-full h-48 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-4xl">💈</div>
        </div>
        
        {/* Rating Badge */}
        {barber.rating > 0 && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Star className="h-3 w-3 fill-current" />
            <span>{barber.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white group-hover:text-primary-500 transition-colors">
          {barber.name}
        </h3>
        
        <div className="flex items-center space-x-2 text-sm text-dark-400">
          <MapPin className="h-4 w-4" />
          <span>{barber.location}</span>
        </div>

        {barber.experience_years > 0 && (
          <div className="flex items-center space-x-2 text-sm text-dark-400">
            <Clock className="h-4 w-4" />
            <span>{barber.experience_years} años de experiencia</span>
          </div>
        )}

        {barber.price_range && (
          <div className="flex items-center space-x-2 text-sm text-dark-400">
            <DollarSign className="h-4 w-4" />
            <span>{barber.price_range}</span>
          </div>
        )}

        {barber.services && (
          <div className="pt-2">
            <p className="text-xs text-dark-400 line-clamp-2">
              {barber.services}
            </p>
          </div>
        )}
      </div>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Explorar Barberos
        </h1>
        <p className="text-xl text-dark-300 max-w-2xl mx-auto">
          Encuentra el barbero perfecto cerca de ti
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleCitySearch} className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
              <input
                type="text"
                placeholder="Buscar por ciudad..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <button type="submit" className="btn-primary">
              Buscar
            </button>
          </form>

          {/* City Filter Pills */}
          {cities.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {cities.slice(0, 8).map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCity === city
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                    }`}
                  >
                    {city}
                  </button>
                ))}
                {selectedCity && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 rounded-full text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Header */}
      {selectedCity && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Barberos en {selectedCity}
          </h2>
          <p className="text-dark-400">
            {barbers.length} barbero{barbers.length !== 1 ? 's' : ''} encontrado{barbers.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Barber Grid */}
      {loading && barbers.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-dark-400">Cargando barberos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {barbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </div>

          {barbers.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💈</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No se encontraron barberos
              </h3>
              <p className="text-dark-400">
                {selectedCity 
                  ? `No hay barberos registrados en ${selectedCity}`
                  : 'No hay barberos registrados aún'
                }
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && barbers.length > 0 && !selectedCity && (
            <div className="text-center mt-8">
              <button
                onClick={() => fetchBarbers(true)}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Cargar más'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore; 