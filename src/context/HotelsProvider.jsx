/* eslint-disable no-unused-vars */
import { createContext, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:5000";
const HotelsContext = createContext();

export default function HotelsProvider({ children }) {
  const [currentHottel, setCurrentHotel] = useState({});
  const [isLoadingCurrHotel, setIsLoadingCurrHotel] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const destination = searchParams.get("destination");
  const room = JSON.parse(searchParams.get("options"))?.room;

  const getHotel = async (id) => {
    try {
      setIsLoadingCurrHotel(true);
      const { data } = await axios.get(`${BASE_URL}/hotels/${id}`);
      setCurrentHotel(data);
      setIsLoadingCurrHotel(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const { isLoading, data: hotels } = useFetch(
    `${BASE_URL}/hotels`,
    `q=${destination || ""}&accommodates_gte=${room || 1}`
  );
  return (
    <HotelsContext.Provider
      value={{ isLoading, hotels, currentHottel, getHotel, isLoadingCurrHotel }}
    >
      {children}
    </HotelsContext.Provider>
  );
}

export function useHotels() {
  return useContext(HotelsContext);
}
