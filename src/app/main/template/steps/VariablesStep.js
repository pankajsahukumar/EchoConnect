import { useMemo } from "react";
import {
    Box,
    Typography,
    TextField,
    Paper,
    Stack,
    Divider,
} from "@mui/material";

export default function VariablesStep({ template, dispatch, updateCurrentTemplate }) {
    // Extract all {{variable}} patterns from header and body text
    const variables = useMemo(() => {
        const vars = [];
        const seen = new Set();

        template?.components?.forEach((comp) => {
            const text = comp.text || "";
            const matches = text.matchAll(/\{\{([^}]+)\}\}/g);

            for (const match of matches) {
                const varName = match[1].trim();
                if (!seen.has(varName)) {
                    seen.add(varName);
                    vars.push({
                        name: varName,
                        source: comp.type,
                        value: comp.example?.[varName] || "",
                    });
                }
            }

            // Check buttons for URL variables
            if (comp.type === "BUTTONS") {
                comp.buttons?.forEach((btn, i) => {
                    const btnUrl = btn.url || "";
                    const btnMatches = btnUrl.matchAll(/\{\{([^}]+)\}\}/g);
                    for (const match of btnMatches) {
                        const varName = match[1].trim();
                        if (!seen.has(`btn_${i}_${varName}`)) {
                            seen.add(`btn_${i}_${varName}`);
                            vars.push({
                                name: varName,
                                source: `Button ${i + 1}`,
                                value: btn.example?.[varName] || "",
                            });
                        }
                    }
                });
            }
        });

        return vars;
    }, [template]);

    const handleVariableChange = (varName, source, value) => {
        const components = template.components ? [...template.components] : [];

        const updatedComponents = components.map((comp) => {
            if (comp.type === source) {
                return {
                    ...comp,
                    example: {
                        ...(comp.example || {}),
                        [varName]: value,
                    },
                };
            }

            // Handle button variables
            if (source.startsWith("Button ") && comp.type === "BUTTONS") {
                const btnIndex = parseInt(source.replace("Button ", "")) - 1;
                const updatedButtons = comp.buttons.map((btn, i) => {
                    if (i === btnIndex) {
                        return {
                            ...btn,
                            example: {
                                ...(btn.example || {}),
                                [varName]: value,
                            },
                        };
                    }
                    return btn;
                });
                return { ...comp, buttons: updatedButtons };
            }

            return comp;
        });

        dispatch(updateCurrentTemplate({ components: updatedComponents }));
    };

    // Group variables by source
    const groupedVars = useMemo(() => {
        const groups = {};
        variables.forEach((v) => {
            if (!groups[v.source]) groups[v.source] = [];
            groups[v.source].push(v);
        });
        return groups;
    }, [variables]);

    return (
        <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Variables examples
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                To help Meta review your template content, provide examples of the variables. Do not include any customer information.
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                Cloud API hosted by Meta reviews templates and variable parameters to protect the security and integrity of Meta's services.
            </Typography>

            {variables.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        No variables found in your template. Add variables using {"{{variableName}}"} syntax in the body or header.
                    </Typography>
                </Paper>
            ) : (
                Object.entries(groupedVars).map(([source, vars]) => (
                    <Paper variant="outlined" sx={{ p: 3, mb: 2 }} key={source}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                            {source}
                        </Typography>

                        {vars.map((v, idx) => (
                            <Box key={`${v.name}-${idx}`}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    {`{{${v.name}}}`}
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={`Enter example for ${v.name}`}
                                    value={v.value}
                                    onChange={(e) =>
                                        handleVariableChange(v.name, v.source, e.target.value)
                                    }
                                    sx={{ mb: 2 }}
                                />
                            </Box>
                        ))}
                    </Paper>
                ))
            )}
        </Box>
    );
}
