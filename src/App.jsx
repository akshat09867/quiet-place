import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore'; 

const leafIcon = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
};
const GreenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  ...leafIcon
});
const RedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  ...leafIcon
});
const DefaultIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  ...leafIcon
});

function LocationMarker({ setTempSpot }) {
  useMapEvents({
    click(e) { setTempSpot({ lat: e.latlng.lat, lng: e.latlng.lng }); },
  });
  return null;
}

function App() {
  const JNU_CENTER = [28.5398, 77.1666];
  const JNU_BOUNDS = [[28.5250, 77.1450], [28.5600, 77.1850]];

  const [spots, setSpots] = useState([]);
  const [tempSpot, setTempSpot] = useState(null);
  const [formName, setFormName] = useState("");
  const [formStatus, setFormStatus] = useState("quiet");
  
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const q = query(collection(db, "spots"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const spotsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpots(spotsData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now()); 
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  const handleAddSpot = async (e) => {
    e.preventDefault();
    if (!formName) return alert("Enter a name!");

    await addDoc(collection(db, "spots"), {
      name: formName,
      status: formStatus,
      lat: tempSpot.lat,
      lng: tempSpot.lng,
      timestamp: Date.now()
    });

    setTempSpot(null);
    setFormName("");
  };

  const TIME_LIMIT = 3600 * 1000; 

  const activeSpots = spots.filter(spot => (now - spot.timestamp) < TIME_LIMIT);

  return (
    <MapContainer 
      center={JNU_CENTER} zoom={16} scrollWheelZoom={true}
      maxBounds={JNU_BOUNDS} minZoom={15} 
      style={{ height: "100vh", width: "100vw" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker setTempSpot={setTempSpot} />

      <div className="leaflet-top leaflet-left mt-4 ml-4" style={{ pointerEvents: 'auto' }}>
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-200 w-64">
          <h1 className="text-xl font-bold text-gray-800">🤫 JNU Quiet Finder</h1>
          <p className="text-xs text-gray-500 mb-2">Crowdsourced Study Spots</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium">Empty / Quiet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm font-medium">Crowded / Noisy</span>
          </div>
          <div className="mt-3 text-xs text-gray-400">
            *Pins vanish in 60 seconds
          </div>
        </div>
      </div>

      {activeSpots.map((spot) => (
        <Marker 
          key={spot.id} 
          position={[spot.lat, spot.lng]}
          icon={spot.status === 'quiet' ? GreenIcon : RedIcon}
        >
          <Popup>
            <div className="text-center min-w-[100px]">
              <h3 className="font-bold text-lg">{spot.name}</h3>
              <div className={`mt-1 inline-block px-2 py-0.5 rounded text-white text-xs font-bold ${spot.status === 'quiet' ? 'bg-green-500' : 'bg-red-500'}`}>
                {spot.status.toUpperCase()}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Expires in:{" "}
                {Math.max(
                0,
                Math.ceil((TIME_LIMIT - (now - spot.timestamp)) / (1000 * 60))
                )}{" "}
                min
              </p>

            </div>
          </Popup>
        </Marker>
      ))}

      {tempSpot && (
        <Marker position={[tempSpot.lat, tempSpot.lng]} icon={DefaultIcon}>
          <Popup closeButton={false} minWidth={220}>
            <div className="p-1">
              <h3 className="font-bold mb-2 text-gray-700">Add New Spot</h3>
              <form onSubmit={handleAddSpot} className="flex flex-col gap-2">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Location Name..." 
                  className="border border-gray-300 p-2 rounded text-sm w-full"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
                <select 
                  className="border border-gray-300 p-2 rounded text-sm w-full bg-white"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                >
                  <option value="quiet">🟢 Quiet / Empty</option>
                  <option value="crowded">🔴 Crowded / Noisy</option>
                </select>
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="bg-black text-white px-3 py-1.5 rounded text-sm flex-1 hover:bg-gray-800">Post</button>
                  <button type="button" onClick={() => setTempSpot(null)} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded text-sm hover:bg-gray-200">Cancel</button>
                </div>
              </form>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default App;