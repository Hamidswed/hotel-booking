import { useHotels } from "../../context/HotelsProvider";

export default function Map() {
  const { isLoading, hotels } = useHotels();
  return <div className="mapContainer">map component</div>;
}
