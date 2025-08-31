import { Box, Typography, IconButton } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

export default function ReplyPreview({ quote, onClose }) {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "7.5px",
        padding: "8px 12px",
        marginBottom: "8px",
        borderLeft: "4px solid #00a884",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: "#00a884" }}>
          Replying to {quote.authorName || "Contact"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#667781" }}>
          {quote.preview}
        </Typography>
      </Box>
      <IconButton size="small" onClick={onClose}>
        <FuseSvgIcon size={18}>heroicons-outline:x-mark</FuseSvgIcon>
      </IconButton>
    </Box>
  );
}
