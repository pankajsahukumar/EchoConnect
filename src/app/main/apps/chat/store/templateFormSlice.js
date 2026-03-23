import { createSlice } from "@reduxjs/toolkit";
import TemplateModel from "src/@models/TemplateModel";
import { TEMPLATE_STEPS } from "src/Constants/TemplateStepContants";

export const selectCurrentTemplate = (state) =>
  state.chatApp.templateForm.currentTemplate;

export const selectTemplateErrors = (state) =>
  state.chatApp.templateForm.errors;

const initialErrors = {
  [TEMPLATE_STEPS.BASIC.key]: {},
  [TEMPLATE_STEPS.CONTENT.key]: {},
  [TEMPLATE_STEPS.BUTTONS.key]: {},
  [TEMPLATE_STEPS.VARIABLES.key]: {},
};

const templatesSlice = createSlice({
  name: "chatApp/templateForm",
  initialState: {
    currentTemplate: new TemplateModel(),
    errors: initialErrors,
  },
  reducers: {
    setCurrentTemplate: (state, action) => {
      state.currentTemplate = action.payload;
    },
    resetCurrentTemplate: (state) => {
      state.currentTemplate = new TemplateModel();
      state.errors = initialErrors; // reset all step errors
    },
    updateCurrentTemplate: (state, action) => {
      let updateTemplateState={ ...state.currentTemplate,
        ...action.payload}
      state.currentTemplate = new TemplateModel(updateTemplateState);
    },
    setTemplateErrors: (state, action) => {
      const { step, errors } = action.payload;
      if (typeof step === "number" && step in state.errors) {
        state.errors = {
          ...state.errors,
          [step]: errors || {},
        };
      }
    },
  },
});

export const {
  setCurrentTemplate,
  resetCurrentTemplate,
  updateCurrentTemplate,
  setTemplateErrors,
} = templatesSlice.actions;

export default templatesSlice.reducer;
