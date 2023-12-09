import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:5000";
const BookmarkContext = createContext();

const initialState = {
  bookmarks: [],
  isLoading: false,
  currentBookmark: {},
  error: null,
};

function bookmarkReducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "bookmarks/loaded":
      return {
        ...state,
        isLoading: false,
        bookmarks: action.payload,
      };
    case "bookmark/loaded":
      return {
        ...state,
        isLoading: false,
        currentBookmark: action.payload,
      };
    case "bookmark/created":
      return {
        ...state,
        isLoading: false,
        bookmarks: [...state.bookmarks, action.payload],
        currentBookmark: action.payload,
      };
    case "bookmark/deleted":
      return {
        ...state,
        isLoading: false,
        bookmarks: state.bookmarks.filter((item) => item.id !== action.payload),
        currentBookmark: {},
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action!");
  }
}

export default function BookmarkProvider({ children }) {
  // const [currentBookmark, setCurrentBookmark] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [bookmarks, setBookmarks] = useState([]);

  const [{ bookmarks, isLoading, currentBookmark }, dispatch] = useReducer(
    bookmarkReducer,
    initialState
  );

  useEffect(() => {
    const fetchBookmarkList = async () => {
      dispatch({ type: "loading" });
      try {
        const { data } = await axios.get(`${BASE_URL}/bookmarks`);
        dispatch({ type: "bookmarks/loaded", payload: data });
      } catch (error) {
        toast.error(error.message);
        dispatch({
          type: "rejected",
          payload: "an error occurred in loading bookmarks!",
        });
      }
    };
    fetchBookmarkList();
  }, []);

  const getBookmark = async (id) => {
    if (Number(id) === currentBookmark?.id) return;
    dispatch({ type: "loading" });
    try {
      const { data } = await axios.get(`${BASE_URL}/bookmarks/${id}`);
      dispatch({ type: "bookmark/loaded", payload: data });
    } catch (error) {
      toast.error(error.message);
      dispatch({
        type: "rejected",
        payload: "an error occurred in loading bookmark!",
      });
    }
  };

  const createBookmark = async (newBookmark) => {
    dispatch({ type: "loading" });
    try {
      const { data } = await axios.post(`${BASE_URL}/bookmarks/`, newBookmark);
      dispatch({ type: "bookmark/created", payload: data });
    } catch (error) {
      toast.error(error.message);
      dispatch({
        type: "rejected",
        payload: "an error occurred in creating bookmark!",
      });
    }
  };

  const deleteBookmark = async (id) => {
    try {
      dispatch({ type: "loading" });
      await axios.delete(`${BASE_URL}/bookmarks/${id}`);
      dispatch({
        type: "bookmark/deleted",
        payload: id,
      });
    } catch (error) {
      toast.error(error.message);
      dispatch({
        type: "rejected",
        payload: "an error occurred in deleting bookmark!",
      });
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
