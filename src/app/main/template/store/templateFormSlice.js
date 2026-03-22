import { createSlice } from "@reduxjs/toolkit";
import TemplateModel from "src/@models/TemplateModel";

export const selectCurrentTemplate = (state) =>
    state.templateBuilder.templateForm.currentTemplate;

export const selectTemplateErrors = (state) =>
    state.templateBuilder.templateForm.errors;

const initialErrors = {
    0: {},
    1: {},
    2: {},
    3: {},
};

const templateFormSlice = createSlice({
    name: "templateBuilder/templateForm",
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
            state.errors = initialErrors;
        },
        updateCurrentTemplate: (state, action) => {
            const updateTemplateState = { ...state.currentTemplate, ...action.payload };
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
} = templateFormSlice.actions;

export default templateFormSlice.reducer;
