import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const { BaseLayer, Overlay } = LayersControl;
const apiKey = 'bfbcf876e6d61d8bffa2e8922b41b9eb'; // Replace with your actual API key

const MapPopup = ({ position, onClose }) => {
  const mapRef = useRef();
  const [selectedPosition, setSelectedPosition] = useState(position);
  const [locationDetails, setLocationDetails] = useState(null);

  const handleClickOutside = (event) => {
    if (mapRef.current && !mapRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, );

  useEffect(() => {
    if (selectedPosition) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${selectedPosition.lat}&lon=${selectedPosition.lng}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
          console.log('API Response:', data); // Log the API response
          if (data.weather && data.weather.length > 0 && data.main && data.name && data.sys) {
            setLocationDetails({
              description: data.weather.description,
              temperature: data.main.temp,
              name: data.name,
              country: data.sys.country
            });
          } else {
            setLocationDetails(null);
          }
        })
        .catch(error => {
          console.error('Error fetching weather:', error);
          setLocationDetails(null);
        });
    }
  }, [selectedPosition]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setSelectedPosition(e.latlng);
      }
    });
    return null;
  };

  return (
    <div ref={mapRef} style={{ position: 'relative' }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "300px", width: "400px" }}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenWeatherMap">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          </BaseLayer>
          <Overlay name="Temperature">
            <TileLayer
              url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
            />
          </Overlay>
        </LayersControl>
        <MapClickHandler />
        <Marker position={selectedPosition}>
          <Popup>
            {locationDetails ? (
              <div>
                <p>{locationDetails.name}, {locationDetails.country}</p>
                <p>{locationDetails.description}, {locationDetails.temperature}°C</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPopup;
