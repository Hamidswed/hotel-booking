import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:5000";
const BookmarkContext = createContext();

export default function BookmarkProvider({ children }) {
  const [currentBookmark, setCurrentBookmark] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarkList = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${BASE_URL}/bookmarks`);
        setBookmarks(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarkList();
  }, []);

  const getBookmark = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/bookmarks/${id}`);
      setCurrentBookmark(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createBookmark = async (newBookmark) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/bookmarks/`, newBookmark);
      setCurrentBookmark(data);
      setBookmarks((prev) => [...prev, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        isLoading,
        currentBookmark,
        getBookmark,
        bookmarks,
        createBookmark,
        deleteBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  return useContext(BookmarkContext);
}
