import { configureStore } from "@reduxjs/toolkit";
import parkingSlice from "../reducer/parkingSlice";
export default configureStore({
    reducer: {
        parkingSpaces: parkingSlice
    }
})