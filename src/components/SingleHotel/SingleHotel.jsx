import { useParams } from "react-router-dom";
import Loader from "./../Loader/Loader";
import { useHotels } from "../../context/HotelsProvider";
import { useEffect } from "react";

export default function SingleHotel() {
  const { id } = useParams();
  const { isLoadingCurrHotel, currentHottel, getHotel } = useHotels();

  useEffect(() => {
    getHotel(id);
  }, [id]);

  if (isLoadingCurrHotel) return <Loader />;

  return (
    <div className="roomDetail">
      <h2>{currentHottel.name}</h2>
      <div>
        {currentHottel.number_of_reviews} reviews &bull;{" "}
        {currentHottel.smart_location}
      </div>
      <img src={currentHottel.thumbnail_url} alt={currentHottel.name} />
    </div>
  );
}
