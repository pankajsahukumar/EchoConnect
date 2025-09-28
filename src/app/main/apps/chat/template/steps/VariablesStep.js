import { useEffect, useMemo } from "react";
import { Box, Typography, TextField, Paper, Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTemplate } from "src/hooks/useTemplate";

export default function VariablesStep() {
  const { template, updateTemplate } = useTemplate();

  // Extract variables from template components and buttons
  const variables = useMemo(() => {
    const vars = [];

    template?.components?.forEach((comp) => {
      // Header and Body
      if (comp.example) {
        Object.entries(comp.example).forEach(([name, value]) => {
          vars.push({ name, value, source: comp.type });
        });
      }

      // Buttons
      if (comp.type === "BUTTONS") {
        comp.buttons?.forEach((btn, i) => {
          if (btn.example) {
            Object.entries(btn.example).forEach(([name, value]) => {
              vars.push({ name, value, source: `Button ${i + 1}` });
            });
          }
        });
      }
    });

    return vars;
  }, [template]);

  // react-hook-form
  const { control, watch } = useForm({
    defaultValues: variables.reduce((acc, v) => {
      acc[v.name] = v.value || "";
      return acc;
    }, {}),
  });

  const watchedValues = watch();

  // Update Redux store only if values actually change
  useEffect(() => {
    if (!variables.length) return;

    const newComponents = template.components.map((comp) => {
      let compChanged = false;

      // Update HEADER or BODY example
      let newComp = { ...comp };
      if (comp.example) {
        const updatedExample = { ...comp.example };
        Object.keys(updatedExample).forEach((key) => {
          if (key in watchedValues && watchedValues[key] !== updatedExample[key]) {
            updatedExample[key] = watchedValues[key];
            compChanged = true;
          }
        });
        if (compChanged) newComp.example = updatedExample;
      }

      // Update BUTTONS example
      if (comp.type === "BUTTONS") {
        const updatedButtons = comp.buttons.map((btn) => {
          if (btn.example) {
            let btnChanged = false;
            const updatedExample = { ...btn.example };
            Object.keys(updatedExample).forEach((key) => {
              if (key in watchedValues && watchedValues[key] !== updatedExample[key]) {
                updatedExample[key] = watchedValues[key];
                btnChanged = true;
              }
            });
            return btnChanged ? { ...btn, example: updatedExample } : btn;
          }
          return btn;
        });
        newComp.buttons = updatedButtons;
        if (JSON.stringify(comp.buttons) !== JSON.stringify(updatedButtons)) compChanged = true;
      }

      return compChanged ? newComp : comp;
    });

    // Only dispatch if components changed
    const isDifferent = JSON.stringify(template.components) !== JSON.stringify(newComponents);
    if (isDifferent) {
      updateTemplate({ components: newComponents });
    }
  }, [watchedValues, template, updateTemplate, variables]);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Variables
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Fill in the values for each variable
      </Typography>

      {variables.length === 0 ? (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography>No variables found in your template.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Stack spacing={2}>
            {variables.map((v) => (
              <Controller
                key={v.name}
                name={v.name}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`${v.name} (${v.source})`}
                    size="small"
                    fullWidth
                  />
                )}
              />
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
