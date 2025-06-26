// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import articleReducer from "./ArticleSlice"; // SƏHV: sən burada `articles` import etmisən amma `articleReducer` istifadə edirsən
import chatReducer from './ChatSlice'
import followReducer from "./FollowersSlice"

export const store = configureStore({
  reducer: {
    users: userReducer,
    chat: chatReducer,
      follow: followReducer,
    articles: articleReducer, // burada `articleReducer` istifadə etdiyinə görə importda da o olmalıdır
  },
});
