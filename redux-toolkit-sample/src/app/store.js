import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../features/posts/postsSlice'
import usersReducer from '../features/users/usersSlice'

//The Redux store is created using the configureStore function from Redux Toolkit. 
//configureStore requires that we pass in a reducer argument
export const store = configureStore({
    //we can pass in all of the different reducers in an object. 
    //The key names in the object will define the keys in our final state value
    reducer: {
        //It says that we want to have a state.counter section of our Redux state object
        // and that we want the counterReducer function to be in charge of deciding if and how to update the state.counter section whenever an action is dispatched
        posts: postsReducer,
        users: usersReducer
    }
})