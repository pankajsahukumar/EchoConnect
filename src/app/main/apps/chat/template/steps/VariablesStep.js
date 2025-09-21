import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Alert,
  Stack,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function VariablesStep({ template }) {
  const extractVariablesFromText = (text) => {
    const regex = /{{([^}]+)}}/g;
    const variables = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      variables.push({
        original: match[0],
        name: match[1],
        displayName: match[1],
        example: "",
      });
    }
    return variables;
  };

  const extractVariablesFromTemplate = useCallback(() => {
    const variables = [];
    const variableMap = new Map();

    const pushUnique = (vars, source) => {
      vars.forEach((v) => {
        if (!variableMap.has(v.original)) {
          variableMap.set(v.original, v);
          variables.push({ ...v, source });
        }
      });
    };

    const header = template.components.find((c) => c.type === "HEADER");
    if (header?.format === "TEXT" && header.text) {
      pushUnique(extractVariablesFromText(header.text), "Header");
    }

    const body = template.components.find((c) => c.type === "BODY");
    if (body?.text) {
      pushUnique(extractVariablesFromText(body.text), "Body");
    }

    const buttonsComponent = template.components.find(
      (c) => c.type === "BUTTONS"
    );
    buttonsComponent?.buttons?.forEach((btn, i) => {
      if (btn.text) {
        pushUnique(extractVariablesFromText(btn.text), `Button ${i + 1}`);
      }
    });

    return variables;
  }, [template]);

  const [variables, setVariables] = useState([]);

  useEffect(() => {
    setVariables(extractVariablesFromTemplate());
  }, [extractVariablesFromTemplate]);

  // Build Yup schema dynamically (each variable is required)
  const schema = yup.object().shape(
    variables.reduce((acc, v) => {
      acc[v.name] = yup.string().required(`${v.original} is required`);
      return acc;
    }, {})
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: variables.reduce((acc, v) => {
      acc[v.name] = "";
      return acc;
    }, {}),
  });

  const onSubmit = (data) => {
    console.log("Filled Variables:", data);
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Variable Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Fill in values for each variable (all fields are required).
      </Typography>

      {variables.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No variables found in your template. Add variables in the Content step
          using the {"{{ }}"} format.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Stack spacing={3}>
              {variables.map((variable, index) => (
                <Box key={index}>
                  <Typography variant="subtitle2" gutterBottom>
                    {variable.displayName} ({variable.source})
                  </Typography>
                  <Controller
                    name={variable.name}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={variable.original}
                        size="small"
                        fullWidth
                        error={!!errors[variable.name]}
                        helperText={errors[variable.name]?.message}
                      />
                    )}
                  />
                </Box>
              ))}
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Stack>
          </Paper>
        </form>
      )}
    </Box>
  );
}
