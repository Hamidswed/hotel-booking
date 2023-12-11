/* eslint-disable no-unused-vars */
import { MdLocationOn } from "react-icons/md";
import { HiCalendar, HiSearch, HiMinus, HiPlus } from "react-icons/hi";
import { useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import {
  Link,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export default function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destination, setDestination] = useState(
    searchParams.get("destination") || ""
  );
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  const handleOptions = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "inc" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const navigate = useNavigate();
  const handleSearch = () => {
    const encodedParams = createSearchParams({
      date: JSON.stringify(date),
      destination,
      options: JSON.stringify(options),
    });
    navigate({
      pathname: "/hotels",
      search: encodedParams.toString(),
    });
    // setSearchParams(encodedParams);
  };
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="header">
      <Link to={"/"}>Home</Link>
      <Link to={"/bookmark"}>Bookmarks</Link>
      <div className="headerSearch">
        <div className="headerSearchItem">
          <MdLocationOn className="headerIcon locationIcon" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            type="text"
            placeholder="where to go?"
            className="headerSearchInput"
            name="destination"
            id="destination"
          />
          <span className="seperator"></span>
        </div>
        <div className="headerSearchItem">
          <HiCalendar className="headerIcon dateIcon" />
          <div onClick={() => setOpenDate(!openDate)} className="dateDropDown">
            {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
              date[0].endDate,
              "MM/dd/yyyy"
            )}`}
          </div>
          {openDate && (
            <DateRange
              onChange={(item) => setDate([item.selection])}
              ranges={date}
              className="date"
              minDate={new Date()}
              moveRangeOnFirstSelection={true}
            />
          )}
          <span className="seperator"></span>
        </div>
        <div className="headerSearchItem">
          <div id="optionDropDwon" onClick={() => setOpenOptions(!openOptions)}>
            {options.adult} adult &bull; {options.children} children &bull;
            {options.room} room
          </div>
          {openOptions && (
            <GuestOptionList
              options={options}
              handleOptions={handleOptions}
              setOpenOptions={setOpenOptions}
            />
          )}
          <span className="seperator"></span>
        </div>
        <div className="headerSearchItem">
          <button className="headerSearchBtn" onClick={handleSearch}>
            <HiSearch className="headerIcon" />
          </button>
        </div>
      </div>
      {isAuthenticated ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <p>Hello {user.name}</p>
          <button className="btn btn--back" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <Link to={"/login"}>Login</Link>
      )}
    </div>
  );
}

function GuestOptionList({ options, handleOptions, setOpenOptions }) {
  const optionsRef = useRef();
  useOutsideClick(optionsRef, "optionDropDwon", () => setOpenOptions(false));
  return (
    <div className="guestOptions" ref={optionsRef}>
      <OptionItem
        options={options}
        type="adult"
        minLimit={1}
        handleOptions={handleOptions}
      />
      <OptionItem
        options={options}
        type="children"
        minLimit={0}
        handleOptions={handleOptions}
      />
      <OptionItem
        options={options}
        type="room"
        minLimit={1}
        handleOptions={handleOptions}
      />
    </div>
  );
}

function OptionItem({ options, type, minLimit, handleOptions }) {
  return (
    <div className="guestOptionItem">
      <span className="optionText">{type}</span>
      <div className="optionCounter">
        <button
          className="optionCounterBtn"
          disabled={options[type] <= minLimit}
          onClick={() => handleOptions(type, "dec")}
        >
          <HiMinus />
        </button>
        <span className="optionCounterNumber">{options[type]}</span>
        <button
          className="optionCounterBtn"
          onClick={() => handleOptions(type, "inc")}
        >
          <HiPlus />
        </button>
      </div>
    </div>
  );
}
