import axios from "axios";
import { createContext, useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:5000";
const BookmarkContext = createContext();

export default function BookmarkProvider({ children }) {
  const [currentBookmark, setCurrentBookmark] = useState({});
  const [isLoadingCurrBookmark, setIsLoadingCurrBookmark] = useState(false);

  const { isLoading, data: bookmarks } = useFetch(`${BASE_URL}/bookmark`);

  const getBookmark = async (id) => {
    try {
      setIsLoadingCurrBookmark(true);
      const { data } = await axios.get(`${BASE_URL}/bookmark/${id}`);
      setCurrentBookmark(data);
      setIsLoadingCurrBookmark(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        isLoading,
        currentBookmark,
        getBookmark,
        isLoadingCurrBookmark,
        bookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  return useContext(BookmarkContext);
}
