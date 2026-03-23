import { useRef, useState } from "react";
import {
    Box,
    TextField,
    Typography,
    Chip,
    Stack,
    Button,
    Paper,
    InputAdornment,
    Tooltip,
    Alert,
    IconButton,
    Checkbox,
    FormControlLabel,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LinkIcon from "@mui/icons-material/Link";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { apiClient } from "src/@api/utils/apiClient";

const HEADER_TYPES = ["None", "Text", "Image", "Video", "Document"];

const VARIABLE_CHIPS = [
    "Tracking Code",
    "Inquiry Code",
    "Location",
    "experience_name",
    "order_id",
    "Agent",
    "Today",
    "Future Date",
    "Opt Out",
];

const ALLOWED_FILE_TYPES = {
    IMAGE: ["image/jpeg", "image/png", "image/jpg"],
    VIDEO: ["video/mp4", "video/webm", "video/ogg"],
    DOCUMENT: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};

const FILE_ACCEPT = {
    IMAGE: "image/jpeg,image/png,image/jpg",
    VIDEO: "video/mp4,video/webm,video/ogg",
    DOCUMENT: ".pdf,.doc,.docx",
};

export default function ContentStep({ template, dispatch, updateCurrentTemplate }) {
    const bodyRef = useRef(null);
    const fileInputRef = useRef(null);
    const [uploadMethod, setUploadMethod] = useState("file");
    const [uploadError, setUploadError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploadedFileName, setUploadedFileName] = useState("");

    const isAuthentication = template.category === "AUTHENTICATION";

    const getComponent = (type) =>
        template.components?.find((c) => c.type === type) || {};

    const updateComponent = (type, data) => {
        const components = template.components ? [...template.components] : [];
        const index = components.findIndex((c) => c.type === type);

        if (index >= 0) {
            if (data === null) {
                components.splice(index, 1);
            } else {
                components[index] = { ...components[index], ...data };
            }
        } else if (data !== null) {
            components.push({ type, ...data });
        }

        dispatch(updateCurrentTemplate({ components }));
    };

    const handleHeaderTypeChange = (type) => {
        const headerType = type.toUpperCase();
        // Reset upload state
        setPreviewUrl("");
        setUploadedFileName("");
        setUploadError("");
        setUploadMethod("file");

        if (headerType === "NONE") {
            updateComponent("HEADER", { format: "NONE", text: undefined, image: undefined, video: undefined, document: undefined });
        } else {
            updateComponent("HEADER", {
                format: headerType,
                text: headerType === "TEXT" ? "" : undefined,
                image: headerType === "IMAGE" ? { url: "" } : undefined,
                video: headerType === "VIDEO" ? { url: "" } : undefined,
                document: headerType === "DOCUMENT" ? { url: "" } : undefined,
            });
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        setUploadError("");
        if (!file) return;

        const headerComponent = getComponent("HEADER");
        const format = headerComponent.format;

        // Validate file type
        if (!ALLOWED_FILE_TYPES[format]?.includes(file.type)) {
            setUploadError(`Please upload a valid ${format.toLowerCase()} file`);
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("File size exceeds 5MB limit");
            return;
        }

        setUploading(true);
        try {
            // Get presigned URL
            const response = await apiClient.get("/api/get/url", {
                fileName: file.name,
                fileType: file.type,
            });
            const presignedUrl = response.data.signedUrl;

            // Upload file to presigned URL
            await fetch(presignedUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });

            // Read file for preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;

                if (format === "IMAGE") {
                    setPreviewUrl(dataUrl);
                    updateComponent("HEADER", { image: { url: presignedUrl.split("?")[0] } });
                } else if (format === "VIDEO") {
                    setPreviewUrl(dataUrl);
                    updateComponent("HEADER", { video: { url: presignedUrl.split("?")[0] } });
                } else if (format === "DOCUMENT") {
                    setUploadedFileName(file.name);
                    updateComponent("HEADER", { document: { url: presignedUrl.split("?")[0] } });
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setUploadError("Failed to upload file. Please try again.");
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleUrlInput = (url) => {
        const headerComponent = getComponent("HEADER");
        const format = headerComponent.format;

        if (format === "IMAGE") {
            setPreviewUrl(url);
            updateComponent("HEADER", { image: { url } });
        } else if (format === "VIDEO") {
            updateComponent("HEADER", { video: { url } });
        } else if (format === "DOCUMENT") {
            updateComponent("HEADER", { document: { url } });
        }
    };

    const handleRemoveFile = () => {
        setPreviewUrl("");
        setUploadedFileName("");
        setUploadError("");
        if (fileInputRef.current) fileInputRef.current.value = "";

        const headerComponent = getComponent("HEADER");
        const format = headerComponent.format;
        if (format === "IMAGE") updateComponent("HEADER", { image: { url: "" } });
        else if (format === "VIDEO") updateComponent("HEADER", { video: { url: "" } });
        else if (format === "DOCUMENT") updateComponent("HEADER", { document: { url: "" } });
    };

    const getHeaderMediaUrl = () => {
        const h = getComponent("HEADER");
        return h.image?.url || h.video?.url || h.document?.url || "";
    };

    const insertVariable = (variableName) => {
        const textarea = bodyRef.current;
        const body = getComponent("BODY");
        const currentText = body.text || "";

        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const varText = `{{${variableName}}}`;
            const newText =
                currentText.substring(0, start) +
                varText +
                currentText.substring(end);
            updateComponent("BODY", { text: newText });

            setTimeout(() => {
                textarea.focus();
                const newPos = start + varText.length;
                textarea.setSelectionRange(newPos, newPos);
            }, 0);
        } else {
            updateComponent("BODY", { text: currentText + `{{${variableName}}}` });
        }
    };

    const handleAddCustomVariable = () => {
        const varName = prompt("Enter variable name (no spaces):");
        if (varName && varName.trim()) {
            insertVariable(varName.trim());
        }
    };

    const headerComponent = getComponent("HEADER");
    const bodyComponent = getComponent("BODY");
    const footerComponent = getComponent("FOOTER");

    const currentHeaderFormat = headerComponent.format || "NONE";

    // --- Render media upload section (Image/Video/Document) ---
    const renderMediaUpload = (format) => {
        const typeLabel = format.charAt(0) + format.slice(1).toLowerCase();
        const fileTypeHints = {
            IMAGE: "Image type allowed: JPG, PNG (Max 5MB)",
            VIDEO: "Video type allowed: MP4 (Max 5MB)",
            DOCUMENT: "Doc type allowed: PDF (Max 5MB)",
        };

        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                    {fileTypeHints[format]}
                </Typography>

                <ToggleButtonGroup
                    value={uploadMethod}
                    exclusive
                    onChange={(_, v) => v && setUploadMethod(v)}
                    size="small"
                    sx={{ mb: 2 }}
                >
                    <ToggleButton value="file" sx={{ textTransform: "none" }}>
                        <UploadFileIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Upload a file
                    </ToggleButton>
                    <ToggleButton value="url" sx={{ textTransform: "none" }}>
                        <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Enter URL
                    </ToggleButton>
                </ToggleButtonGroup>

                {uploadError && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError("")}>
                        {uploadError}
                    </Alert>
                )}

                {uploadMethod === "file" ? (
                    <Box>
                        <Button
                            variant="contained"
                            component="label"
                            disabled={uploading}
                            startIcon={<UploadFileIcon />}
                            sx={{
                                bgcolor: "#128C7E",
                                "&:hover": { bgcolor: "#075E54" },
                                textTransform: "none",
                            }}
                        >
                            {uploading ? "Uploading..." : `Upload ${typeLabel}`}
                            <input
                                type="file"
                                hidden
                                accept={FILE_ACCEPT[format]}
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                            />
                        </Button>

                        {/* Image preview */}
                        {format === "IMAGE" && previewUrl && (
                            <Box sx={{ mt: 2, maxWidth: 320, position: "relative" }}>
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    style={{ width: "100%", borderRadius: 8 }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={handleRemoveFile}
                                    sx={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                        bgcolor: "rgba(255,255,255,0.85)",
                                        "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                                    }}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}

                        {/* Video preview */}
                        {format === "VIDEO" && previewUrl && (
                            <Box sx={{ mt: 2, maxWidth: 320, position: "relative" }}>
                                <video
                                    src={previewUrl}
                                    controls
                                    style={{ width: "100%", borderRadius: 8 }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={handleRemoveFile}
                                    sx={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                        bgcolor: "rgba(255,255,255,0.85)",
                                    }}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}

                        {/* Document preview */}
                        {format === "DOCUMENT" && uploadedFileName && (
                            <Paper
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    p: 1.5,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    maxWidth: 320,
                                }}
                            >
                                <InsertDriveFileIcon sx={{ color: "#e53935" }} />
                                <Typography variant="body2" sx={{ flex: 1 }} noWrap>
                                    {uploadedFileName}
                                </Typography>
                                <IconButton size="small" onClick={handleRemoveFile}>
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Paper>
                        )}
                    </Box>
                ) : (
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={`Enter ${typeLabel.toLowerCase()} URL`}
                        value={getHeaderMediaUrl()}
                        onChange={(e) => handleUrlInput(e.target.value)}
                    />
                )}
            </Box>
        );
    };

    // --- Authentication template content ---
    if (isAuthentication) {
        return (
            <Box>
                <Alert severity="warning" sx={{ mb: 3, bgcolor: "#fff9e6", border: "1px solid #ffe0b2" }}>
                    <Typography variant="body2" color="text.secondary">
                        Content for authentication message templates can't be edited.
                    </Typography>
                </Alert>

                {/* Body */}
                <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Body
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        disabled
                        value={bodyComponent.text || "{{1}} is your verification code."}
                        placeholder="{{1}} is your verification code."
                        sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "rgba(0,0,0,0.6)",
                            },
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "right", mt: 0.5 }}>
                        {(bodyComponent.text || "{{1}} is your verification code.").length}/1024
                    </Typography>
                </Paper>

                {/* Security disclaimer */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={template.securityDisclaimer ?? false}
                            onChange={(e) =>
                                dispatch(updateCurrentTemplate({ securityDisclaimer: e.target.checked }))
                            }
                            color="success"
                        />
                    }
                    label={
                        <Typography variant="body2">
                            For your security, do not share this code.
                        </Typography>
                    }
                    sx={{ mb: 1 }}
                />

                {/* Expiration time */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={template.addExpiration ?? false}
                            onChange={(e) =>
                                dispatch(updateCurrentTemplate({ addExpiration: e.target.checked }))
                            }
                            color="success"
                        />
                    }
                    label={
                        <Typography variant="body2">
                            Add expiration time for the code
                        </Typography>
                    }
                    sx={{ mb: 2 }}
                />

                {template.addExpiration && (
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Enter expiration time
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            The expiration time is set between 1 and 90 minutes.
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                            <TextField
                                type="number"
                                size="small"
                                value={template.expirationMinutes ?? 30}
                                onChange={(e) => {
                                    const val = Math.min(90, Math.max(1, parseInt(e.target.value) || 1));
                                    dispatch(updateCurrentTemplate({ expirationMinutes: val }));
                                }}
                                inputProps={{ min: 1, max: 90 }}
                                sx={{ width: 120 }}
                                label="Expires in"
                            />
                            <Typography variant="body2" color="text.secondary">
                                minutes
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                            Enter a value between 1 to 90 (minutes)
                        </Typography>
                    </Paper>
                )}
            </Box>
        );
    }

    // --- Regular (Marketing / Utility) template content ---
    return (
        <Box>
            {/* Header Section */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Header (Optional)
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Add a title for your message. Your title can't include more than one variable
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    {HEADER_TYPES.map((type) => {
                        const isActive = currentHeaderFormat === type.toUpperCase();
                        return (
                            <Chip
                                key={type}
                                label={type}
                                onClick={() => handleHeaderTypeChange(type)}
                                color={isActive ? "success" : "default"}
                                variant={isActive ? "filled" : "outlined"}
                                sx={{
                                    borderRadius: "6px",
                                    px: 1,
                                    fontWeight: isActive ? 600 : 400,
                                }}
                            />
                        );
                    })}
                </Stack>

                {/* Header content based on type */}
                {currentHeaderFormat === "TEXT" && (
                    <TextField
                        fullWidth
                        sx={{ mt: 2 }}
                        placeholder="Enter header text"
                        value={headerComponent.text || ""}
                        onChange={(e) =>
                            updateComponent("HEADER", { text: e.target.value })
                        }
                    />
                )}

                {currentHeaderFormat === "IMAGE" && renderMediaUpload("IMAGE")}
                {currentHeaderFormat === "VIDEO" && renderMediaUpload("VIDEO")}
                {currentHeaderFormat === "DOCUMENT" && renderMediaUpload("DOCUMENT")}
            </Paper>

            {/* Body Section */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Body
                    </Typography>
                    <Tooltip title="Message body content">
                        <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    </Tooltip>
                </Box>

                {/* Variable Chips */}
                <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2, flexWrap: "wrap", gap: 1 }}>
                    {VARIABLE_CHIPS.map((chip) => (
                        <Chip
                            key={chip}
                            label={chip}
                            size="small"
                            variant="outlined"
                            onClick={() => insertVariable(chip)}
                            sx={{
                                borderRadius: "6px",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "action.hover" },
                            }}
                        />
                    ))}
                </Stack>

                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Type message body"
                    value={bodyComponent.text || ""}
                    onChange={(e) => updateComponent("BODY", { text: e.target.value })}
                    inputRef={bodyRef}
                    inputProps={{ maxLength: 1024 }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                        To add a custom variable, please add a variable in double curly brackets without a space. e.g. {"{{VariableName}}"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            {bodyComponent.text?.length || 0}/1024
                        </Typography>
                        <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={handleAddCustomVariable}
                            sx={{ textTransform: "none", fontSize: "0.8rem" }}
                        >
                            Add Variable
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Footer Section */}
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Footer (Optional)
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Type message footer"
                    value={footerComponent.text || ""}
                    onChange={(e) => updateComponent("FOOTER", { text: e.target.value })}
                    inputProps={{ maxLength: 60 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography variant="caption" color="text.secondary">
                                    {footerComponent.text?.length || 0}/60
                                </Typography>
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>
        </Box>
    );
}
