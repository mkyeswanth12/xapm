import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { VolumeStateType, VolumeObj, VolumeNameObj } from "../../types";

const initialState: VolumeStateType = {
  arrayOfVolumeNames: [],
  volumeContainersList: [],
};

export const volumeSlice = createSlice({
  name: "volumes",
  initialState,
  reducers: {
    getVolumes: (state, action: PayloadAction<VolumeNameObj[]>) => {
      state.arrayOfVolumeNames.push(...action.payload);
    },
    getVolumeContainersList: (state, action: PayloadAction<VolumeObj>) => {
      state.volumeContainersList.push(action.payload);
    },
  },
});

export const { getVolumes, getVolumeContainersList } = volumeSlice.actions;
export default volumeSlice.reducer;
