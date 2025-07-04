import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCalling: false,       
  isReceiving: false,    
  from: null,              
  to: null,                
  offer: null,             
  answer: null,           
  callAccepted: false,     
  callRejected: false,     
  inCall: false,           
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    startCall: (state, action) => {
      state.isCalling = true;
      state.to = action.payload.to;
      state.offer = action.payload.offer;
    },
    receiveCall: (state, action) => {
      state.isReceiving = true;
      state.from = action.payload.from;
      state.offer = action.payload.offer;
    },
    acceptCall: (state, action) => {
      state.callAccepted = true;
      state.answer = action.payload.answer;
      state.inCall = true;
    },
    rejectCall: (state) => {
      state.callRejected = true;
      state.isReceiving = false;
      state.inCall = false;
    },
    endCall: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  startCall,
  receiveCall,
  acceptCall,
  rejectCall,
  endCall,
} = videoSlice.actions;

export default videoSlice.reducer;
