import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// type locationType = {
//   latitude: number,
//   longitude: number
// }
export default function MapComponent() {
  
  return (
    <MapContainer center={[36.10455, 128.4192]} zoom={13} scrollWheelZoom={false} style={{width: "200px", height: "200px"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[36.10455, 128.4192]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}