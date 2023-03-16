import { createSlice } from '@reduxjs/toolkit';
type PaymentCompleteAction = {
    type: string;
    payload:any;
  };
export const parkingSlice = createSlice({
    name: "Parking Space",
    initialState: {
        numSpaces: 0,
        occupiedSpaces: 0,
        spaces: {},
    },
    reducers: {
        initializeParkingLot: (state, action) => {
            state.numSpaces = action.payload;
        },
        addToParkingSpace: (state) => {
            state.numSpaces+= 1;  
        },
        removeParkingSpace: (state: any) => {
            const spaces = state.spaces;
            delete spaces[state.numSpaces];
            state.numSpaces -= 1
        },
        
        occupyParkingLots: (state: any, action) => {
            const { spaceNum, registration, parkingTime } = action.payload;
            state.spaces[spaceNum] = { registration, parkingTime };
            state.occupiedSpaces++;
        },
        paymentComplete: (state: any, action: PaymentCompleteAction) => {
            const spaces = state.spaces;
            const selected  = action.payload;
            delete spaces[selected];
            state.occupiedSpaces--;
        }
    }
})
export const { initializeParkingLot, occupyParkingLots, addToParkingSpace, removeParkingSpace, paymentComplete} = parkingSlice.actions;
export default parkingSlice.reducer;