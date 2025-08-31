import { lighten } from "@mui/material/styles";
import { Toolbar, IconButton, Typography, Box } from "@mui/material";
import ChatMoreMenu from "../ChatMoreMenu";
import CustomerInfoButton from "../CustomerInfoButton";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import ContactAvatar from "../../ContactAvatar";

export default function ChatHeader({ contact, onSidebarToggle, onContactInfo }) {
  return (
    <Box
      className="w-full border-b-1"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? lighten(theme.palette.background.default, 0.4)
            : lighten(theme.palette.background.default, 0.02),
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar className="flex items-center justify-between px-16 w-full">
        <div className="flex items-center">
          <IconButton
            aria-label="Open drawer"
            onClick={onSidebarToggle}
            className="flex lg:hidden"
            size="large"
          >
            <FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>
          </IconButton>
          <div
            className="flex items-center cursor-pointer"
            onClick={onContactInfo}
            role="button"
            tabIndex={0}
          >
            <ContactAvatar className="relative mx-8" contact={contact} />
            <Typography className="text-16 font-semibold px-4" sx={{ fontWeight: 600 }}>
              {contact?.name}
            </Typography>
          </div>
        </div>
        <div className="flex">
          <ChatMoreMenu />
          <CustomerInfoButton />
        </div>
      </Toolbar>
    </Box>
  );
}
