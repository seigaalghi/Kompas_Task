import { createContext, useReducer } from "react";
import setAuthToken from "../utility/setAuthToken";

const initialState = {
  isLogin: false,
  author: {},
  login: {
    isOpen: false,
  },
  register: {
    isOpen: false,
  },
  posts: [],
  post: {},
  alert: {
    type: "",
    isOpen: false,
    message: "",
  },
};

export const setAlert = (dispatch, type, message) => {
  dispatch({
    type: "SET_ALERT",
    payload: { type, message },
  });
  setTimeout(
    () =>
      dispatch({
        type: "REMOVE_ALERT",
      }),
    3000
  );
};

const reducer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case "OPEN_LOGIN":
      return {
        ...state,
        login: { isOpen: true },
      };
    case "CLOSE_LOGIN":
      return {
        ...state,
        login: { isOpen: false },
      };
    case "OPEN_REGISTER":
      return {
        ...state,
        register: { isOpen: true },
      };
    case "CLOSE_REGISTER":
      return {
        ...state,
        register: { isOpen: false },
      };
    case "LOGIN":
      localStorage.setItem("token", payload.token);
      setAuthToken(payload.token);
      return {
        ...state,
        isLogin: true,
        author: payload.author,
        login: {
          isOpen: false,
        },
      };
    case "REGISTER":
      localStorage.setItem("token", payload.token);
      setAuthToken(payload.token);
      return {
        ...state,
        isLogin: true,
        author: payload.author,
        register: {
          isOpen: false,
        },
      };
    case "LOAD_USER":
      return {
        ...state,
        isLogin: true,
        author: payload.author,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        isLogin: false,
        author: {},
      };
    case "LOAD_POSTS":
      return {
        ...state,
        posts: payload,
      };
    case "LOAD_POST":
      return {
        ...state,
        post: payload,
      };
    case "ADD_POST":
      return {
        ...state,
        posts: [...state.posts, payload],
      };
    case "ADD_LIKE":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === payload.id ? { ...state.post, likes: [...post.likes, payload.like] } : post
        ),
        post: { ...state.post, likes: [...state.post.likes, payload.like] },
      };
    case "DELETE_LIKE":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === payload.postId
            ? { ...state.post, likes: post.likes.map((like) => like.authorId !== payload.authorId) }
            : post
        ),
        post: {
          ...state.post,
          likes: state.post.likes.filter((like) => like.authorId !== payload.authorId),
        },
      };
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => post.id !== payload.postId),
      };
    case "ADD_COMMENT":
      return {
        ...state,
        post: { ...state.post, comments: [payload.comment, ...state.post.comments] },
      };
    case "DELETE_COMMENT":
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter((comment) => comment.id !== payload.commentId),
        },
      };
    case "SET_ALERT":
      return {
        ...state,
        alert: {
          isOpen: true,
          message: payload.message,
          type: payload.type,
        },
      };
    case "REMOVE_ALERT":
      return {
        ...state,
        alert: {
          isOpen: false,
          message: "",
          type: "",
        },
      };
    default:
      return state;
  }
};

export const AppContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppContext.Provider value={[state, dispatch]}>{props.children}</AppContext.Provider>;
};

export const AppContext = createContext();
