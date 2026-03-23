
import {createSlice } from '@reduxjs/toolkit';
const initialState = {
    DocumentOverlayIsOpen: false,
    GalleryOverlayIsOpen: false,
    voiceMessagePanelIsOpen: false,
    templateOverlayIsOpen: false,
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
    toggleTemplatePanelOverlay: (state) => {
      state.templateOverlayIsOpen = !state.templateOverlayIsOpen;
    },
  },
});
export const selectOverlay = ({ chatApp }) => chatApp.overlay;
export const { toggleDocumentOverlay, toggleGalleryOverlay, closeOverlay, toggleVoiceMessagePanelOverlay,toggleTemplatePanelOverlay } = overlaySlice.actions;
export default overlaySlice.reducer;
