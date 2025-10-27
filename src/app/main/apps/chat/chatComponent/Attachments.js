import { Divider, Typography, Menu, MenuItem } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import AttachmentOptionFile from "./AttachmentOptionFile";
import { useDispatch } from "react-redux";
import { addFiles } from "../store/filesSlice";
import { toggleDocumentOverlay } from "../store/overlaySlice";

export default function Attachments({ setAnchorEl, anchorEl }) {
  const RTK_dispatch = useDispatch();

  const handleFilesChange = (e, from) => {
    const files = e.target.files;
    RTK_dispatch(addFiles({ files, from }));
    RTK_dispatch(toggleDocumentOverlay());
  };
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <AttachmentOptionFile
        fromType="document"
        iconSrc="heroicons-outline:photograph"
        title="Photos & Videos"
        multiple
        acceptedTypes={["image/*", "video/*"]}
        onChange={(e) => handleFilesChange(e, "videos&photos")}
      />
      <AttachmentOptionFile
        fromType="Document / PDF"
        iconSrc="heroicons-outline:document-text"
        title="Document"
        acceptedTypes={["audio/*", "image/*", "video/*", "application/pdf"]}
        onChange={(e) => handleFilesChange(e, "document")}
        multiple
      />
      <MenuItem>
        <FuseSvgIcon className="mr-2">heroicons-outline:music-note</FuseSvgIcon>
        Audio
      </MenuItem>
      {/* <MenuItem onClick={() => setTemplateOpen(true)}>
          <FuseSvgIcon className="mr-2">
            heroicons-outline:template
          </FuseSvgIcon>
          Template
        </MenuItem> */}
      <Divider />
      <MenuItem>
        <Typography sx={{ color: "#00a884", fontWeight: 600 }}>
          Mobile Commerce
        </Typography>
      </MenuItem>
      <MenuItem>
        <FuseSvgIcon className="mr-2">
          heroicons-outline:shopping-bag
        </FuseSvgIcon>
        Products
      </MenuItem>
      <MenuItem>
        <FuseSvgIcon className="mr-2">heroicons-outline:collection</FuseSvgIcon>
        Catalogues
      </MenuItem>
    </Menu>
  );
}
