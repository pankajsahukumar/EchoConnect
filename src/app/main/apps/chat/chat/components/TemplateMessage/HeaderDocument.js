import { Box, Typography, IconButton } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";

const HeaderDocument = ({ link, fileName, thumbnailUrl }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "7.5px",
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        backgroundColor: "#fff",
        marginBottom: "8px",
      }}
    >
      {/* Thumbnail preview */}
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt="Document preview"
          style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
        />
      )}

      {/* Document info row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          backgroundColor: "#f0f2f5",
        }}
      >
        {/* Left side: icon + text */}
        <Box display="flex" alignItems="center" gap={1}>
          <PictureAsPdfIcon sx={{ color: "#d93025" }} />
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#111b21",
                lineHeight: 1.3,
              }}
            >
              PDF Document
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#667781",
              }}
            >
              {fileName ? fileName.split(".").pop().toUpperCase() : "PDF"}
            </Typography>
          </Box>
        </Box>

        {/* Download button */}
        <IconButton
          onClick={() => window.open(link, "_blank")}
          size="small"
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <DownloadIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default HeaderDocument;
