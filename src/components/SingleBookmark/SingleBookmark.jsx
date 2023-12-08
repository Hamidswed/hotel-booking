import { useNavigate, useParams } from "react-router-dom";
import { useBookmark } from "../../context/BookmarkProvider";
import { useEffect } from "react";
import Loader from "../Loader/Loader";

export default function SingleBookmark() {
  const { id } = useParams();
  const { getBookmark, isLoading, currentBookmark } = useBookmark();
  const navigate = useNavigate();
  useEffect(() => {
    getBookmark(id);
  }, [id]);

  if (isLoading) return <Loader />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn--back">
        &larr; Back
      </button>
      <h2>{currentBookmark.cityName}</h2>
      <p>
        {currentBookmark.cityName} - {currentBookmark.country}
      </p>
    </div>
  );
}
