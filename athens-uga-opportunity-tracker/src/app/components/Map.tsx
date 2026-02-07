'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect, useState } from 'react'
import MapResize from './MapResize'
import L from 'leaflet'
import "leaflet/dist/leaflet.css"
import { posts } from "../data/posts"
import { geoCaches } from '../data/geo-caches'

const defaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [0, 0],
  popupAnchor: [12, 0]
});

const geoCacheIcon = L.icon({
  iconUrl: "/images/geo-cache-icon.png", 
  iconSize: [25, 41],
  iconAnchor: [0, 0],
  popupAnchor: [12, 0]
});


export default function Map() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
    fetch("/api/items")
        .then(res => res.json())
        .then(data => setItems(data));
    }, []);

    const itemsList = items.map((item) => (
        <Marker key={item._id} position={[+item.x, +item.y]} icon={defaultIcon}>
            <Popup className="flex flex-col items-center">
                <h3>{item.title}</h3>
                <p>x: {item.x}, y: {item.y}</p>
            </Popup>
        </Marker>
    ));

    const [cachesOn, setCachesOn] = useState(false);

    function handleClick() {
        setCachesOn(!cachesOn)
    }

    return (
        // testing a change to the map page
        <div className='flex flex-col h-[80vh] gap-6'>
            <button className='geo_btn' onClick={handleClick}> GeoCaches {cachesOn ? 'on' : 'off'} </button>
                <MapContainer className="map z-0" center={[33.960, -83.377]} zoom={14} scrollWheelZoom={true}>
                    <MapResize></MapResize>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {itemsList}
                    {cachesOn && 
                        geoCaches.map((cache) => (
                            <Marker key={cache.id} position={[+cache.x, +cache.y]} icon={geoCacheIcon}>
                                <Popup className="flex flex-col items-center">
                                    <h3>{cache.title}</h3>
                                    <p>x: {cache.x}, y: {cache.y}</p>
                                </Popup>
                            </Marker>
                        ))
                    }
                </MapContainer>
        </div>
    );
}
