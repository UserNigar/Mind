import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import articleReducer from "./ArticleSlice";
import chatReducer from './ChatSlice'
import followReducer from "./FollowersSlice"
import favoriteReducer from "./favoriteSlice"
 
import videoReducer from "./VideoSlice";
export const store = configureStore({
  reducer: {
    users: userReducer,
    chat: chatReducer,
    follow: followReducer,
    favorite: favoriteReducer,
    articles: articleReducer, 
    video: videoReducer,

  },
});
