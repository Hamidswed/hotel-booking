import ReactCountryFlag from "react-country-flag";
import { useBookmark } from "../../context/BookmarkProvider";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

export default function Bookmark() {
  const { isLoading, bookmarks, currentBookmark } = useBookmark();

  console.log(bookmarks);
  if (isLoading) return <Loader />;
  return (
    <div>
      <h2>Bookmark list</h2>
      <div className="bookmarkList">
        {bookmarks.map((item) => {
          return (
            <Link
              key={item.id}
              to={`${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
            >
              <div
                className={`bookmarkItem ${
                  item.id === currentBookmark.id && "current-bookmark"
                }`}
              >
                <ReactCountryFlag svg countryCode={item.countryCode} />
                &nbsp; <strong>{item.cityName}</strong> &nbsp;
                <span>{item.country}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
