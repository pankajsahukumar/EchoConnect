
import {createSlice } from '@reduxjs/toolkit';
const initialState = {
    DocumentOverlayIsOpen: false,
    GalleryOverlayIsOpen: false,
    voiceMessagePanelIsOpen: false,
  };



const overlaySlice = createSlice({
  name: 'chatApp/overlay',
  initialState: initialState,
  reducers: {
    toggleDocumentOverlay: (state) => {
      state.DocumentOverlayIsOpen = !state.DocumentOverlayIsOpen;
    },
    closeOverlay: (state) => {
      state.DocumentOverlayIsOpen = false;
    },
    toggleGalleryOverlay: (state) => {
      state.GalleryOverlayIsOpen = !state.GalleryOverlayIsOpen;
    },
    toggleVoiceMessagePanelOverlay: (state) => {
      state.voiceMessagePanelIsOpen = !state.voiceMessagePanelIsOpen;
    },
  },
});
export const selectOverlay = ({ chatApp }) => chatApp.overlay;
export const { toggleDocumentOverlay, toggleGalleryOverlay, closeOverlay, toggleVoiceMessagePanelOverlay } = overlaySlice.actions;
export default overlaySlice.reducer;
