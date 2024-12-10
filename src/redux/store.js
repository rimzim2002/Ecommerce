 
 import { configureStore } from '@reduxjs/toolkit'; 

 import themeSlice from './reducer'
 const store = configureStore({
   reducer: {
     theme: themeSlice,
   },
 });
 
 export default store;