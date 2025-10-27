import FuseUtils from '@fuse/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const initialState = {
    from: null,
    files: [],
    loadedFiles: [],
    fileToPreview: { type: 'others', url: undefined, id: null, name: null, size: 0, attachedMessage: null },
  };


const filesSlice = createSlice({
  name: 'chatApp/files',
  initialState: initialState,
  reducers: {
    addFiles: (state, { payload }) => {
      const newFiles= [];
      if (payload.files) {
        Array.from(payload.files).map((file) => {
          newFiles.push({ file, id: FuseUtils.generateMessageUUID() });
        });
      }
      return {
        ...state,
        from: payload.from,
        files: newFiles,
      };
    },
    addMoreFiles: (state, { payload }) => {
      const moreFiles = [];
      if (payload) {
        Array.from(payload).map((file) => moreFiles.push({ file, id: FuseUtils.generateMessageUUID() }));
      }
      return {
        ...state,
        files: [...state.files, ...moreFiles],
      };
    },
    addLoadedFiles: (state, { payload }) => {
      return {
        ...state,
        loadedFiles: payload.loadedFiles,
      };
    },
    addAttachedMessage: (state, { payload }) => {
      const foundedFile = state.loadedFiles.find((file) => file.id === state.fileToPreview.id);
      if (foundedFile) {
        foundedFile.attachedMessage = payload;
      }
    },
    resetFiles: (state) => {
      return {
        files: [],
        fileToPreview: { id: '', name: '', size: 0, type: 'others', url: undefined, attachedMessage: null },
        from: null,
        loadedFiles: [],
      };
    },
    addFileToPreview: (state, { payload }) => {
      return {
        ...state,
        fileToPreview: payload,
      };
    },
    addThumbnailPathOfLoadedFile: (state, { payload }) => {
      const foundedFile = state.loadedFiles.find((file) => file.id === payload.id);
      if (foundedFile) {
        foundedFile.thumbnailPath = payload.path;
      }
    },
    removeFile: (state, { payload }) => {
      const filteredLoadedFiles = state.loadedFiles.filter((loadedFile) => loadedFile.id !== payload.id);
      const firstLoadedFile = filteredLoadedFiles[0];
      let newFileToPreview = state.fileToPreview;
      if (state.fileToPreview.id === payload.id) {
        newFileToPreview = {
          ...firstLoadedFile,
          name: firstLoadedFile.file.name,
          size: firstLoadedFile.file.size,
          attachedMessage: firstLoadedFile.attachedMessage,
          url: URL.createObjectURL(firstLoadedFile.file),
        };
        state.fileToPreview = newFileToPreview;
      }

      state.loadedFiles = filteredLoadedFiles;
    },
  },
});
export const { addFiles, removeFile, resetFiles, addLoadedFiles, addFileToPreview, addAttachedMessage, addMoreFiles, addThumbnailPathOfLoadedFile } =
filesSlice.actions;
export const selectFiles = ({ chatApp }) => chatApp.files;

export default filesSlice.reducer;

  
