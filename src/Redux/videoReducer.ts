import {createSlice} from '@reduxjs/toolkit';

export interface VideoState {
  value: any[];
}

const initialState: VideoState = {
  value: [],
};

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    update: (state, action) => {
      const video = action.payload;
      const check_index = state?.value?.findIndex(item => item.name === video.name);
      if (check_index > -1) {
        state.value[check_index].loaded = video.loaded;
      } else {
        state.value.push(video);
      }
    },
  },
});

export const {update} = videoSlice.actions;

export default videoSlice.reducer;
