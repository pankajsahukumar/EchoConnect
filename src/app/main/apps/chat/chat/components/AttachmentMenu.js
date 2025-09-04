import {
    Divider,
    Typography,
    Menu,
    MenuItem,
    Input,
  } from "@mui/material";
  import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
  
  export default function AttachmentMenu({
    setAnchorEl,
    setTemplateOpen,
    anchorEl,
    handlePickImage,
  }) {
   
    return (
        <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem
          onClick={() => {
            handlePickImage();
            setAnchorEl(null);
          }}
        >
          <FuseSvgIcon className="mr-2">
            heroicons-outline:photograph
          </FuseSvgIcon>
          Photo/Video
        </MenuItem>

        <MenuItem>
          <FuseSvgIcon className="mr-2">
            heroicons-outline:music-note
          </FuseSvgIcon>
          Audio
        </MenuItem>
        <MenuItem>
          <FuseSvgIcon className="mr-2">
            heroicons-outline:document-text
          </FuseSvgIcon>
          Document / PDF
        </MenuItem>
        <MenuItem onClick={() => setTemplateOpen(true)}>
          <FuseSvgIcon className="mr-2">
            heroicons-outline:template
          </FuseSvgIcon>
          Template
        </MenuItem>
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
          <FuseSvgIcon className="mr-2">
            heroicons-outline:collection
          </FuseSvgIcon>
          Catalogues
        </MenuItem>
      </Menu>
    );
  }
  