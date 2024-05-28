import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent() {
  const latitude = localStorage.getItem('lat');
  const longitude = localStorage.getItem('long');
  return (
    !latitude || !longitude || latitude !== 'none' || latitude !== 'none' ?
    <MapContainer center={[Number(latitude), Number(longitude)]} zoom={13} scrollWheelZoom={false} style={{width: "200px", height: "200px"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[Number(latitude), Number(longitude)]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
    : <p style={{margin: '50px'}}>위치정보가 없습니다.</p>
  );
}