import { Button, Box } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";

// ✅ Button Types aligned with WhatsApp
const ButtonTypes = {
  CUSTOM: "CUSTOM",
  VISIT_WEBSITE: "URL",
  CALL_WHATSAPP: "CALL_WHATSAPP",
  CALL_PHONE: "PHONE_NUMBER",
  COPY_CODE: "OTP",
  QUICK_REPLY: "QUICK_REPLY",
};

// ✅ Styled Components
const TemplateButton = styled(Button)({
  width: "100%",
  backgroundColor: "transparent",
  color: "rgb(0, 157, 226)",
  borderRadius: 0,
  padding: "10px 12px",
  fontSize: "14px",
  fontWeight: 500,
  textTransform: "none",
  justifyContent: "center", // 👈 Center align text
  "&:hover": { backgroundColor: "rgba(0, 168, 132, 0.05)" },
});

const TemplateButtonBox = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  borderTop: "1px solid rgba(189, 216, 200, 0.5)",
  position: "relative",
});

const CopyToast = styled.div`
  position: absolute;
  top: -28px;
  right: 8px;
  background: #4caf50;
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
`;

// ✅ Main Component
const ButtonComponent = ({ button, maxVisibleButtons = 2 }) => {
  const [open, setOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ✅ Button Click Handler
  const handleButtonClick = (btn) => {
    switch (btn.type) {
      case ButtonTypes.VISIT_WEBSITE:
        if (btn.url) window.open(btn.url, "_blank");
        break;
      case ButtonTypes.CALL_PHONE:
        if (btn.phoneNumber) window.open(`tel:${btn.phoneNumber}`);
        break;
      case ButtonTypes.CALL_WHATSAPP:
        if (btn.phoneNumber) window.open(`https://wa.me/${btn.phoneNumber}`);
        break;
      case ButtonTypes.CUSTOM:
        console.log("Custom action:", btn.text);
        break;
      case ButtonTypes.COPY_CODE:
        if (btn.text) {
          navigator.clipboard
            .writeText(btn.text)
            .then(() => setCopySuccess("Code copied!"))
            .catch(() => setCopySuccess("Failed to copy code"));
          setTimeout(() => setCopySuccess(""), 2000);
        }
        break;
      case ButtonTypes.QUICK_REPLY:
        console.log("Quick Reply clicked:", btn.text);
        break;
      default:
        console.warn("Unhandled button type:", btn.type);
    }
    handleClose();
  };

  if (!button || button.length === 0) return null;

  const visibleButtons = button.slice(0, maxVisibleButtons);
  const overflowButtons = button.slice(maxVisibleButtons);

  const getButtonIcon = (type) => {
    switch (type) {
      case ButtonTypes.VISIT_WEBSITE:
        return "🔗";
      case ButtonTypes.CALL_PHONE:
        return "📞";
      case ButtonTypes.CALL_WHATSAPP:
        return "💬";
      case ButtonTypes.COPY_CODE:
        return "🎟️";
      case ButtonTypes.CUSTOM:
        return "✨";
      default:
        return "";
    }
  };

  return (
    <TemplateButtonBox>
      {copySuccess && <CopyToast>{copySuccess}</CopyToast>}

      {/* Visible Buttons */}
      {visibleButtons.map((btn, idx) => (
        <TemplateButton key={idx} onClick={() => handleButtonClick(btn)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {getButtonIcon(btn.type)} {btn.text}
          </Box>
        </TemplateButton>
      ))}

      {/* Overflow (More Options) */}
      {overflowButtons.length > 0 && (
        <>
          <TemplateButton onClick={handleOpen}>
            More options ({overflowButtons.length})
          </TemplateButton>

          {/* Modal Overlay */}
          {open && (
            <Box
              component="div"
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center", // 👈 Centered vertically
                zIndex: 1000,
              }}
              onClick={handleClose}
            >
              {/* Floating Dialog */}
              <Box
                sx={{
                  backgroundColor: "#fff",
                  width: "90%",
                  maxWidth: 320,
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0px 6px 18px rgba(0,0,0,0.25)",
                  transform: open ? "scale(1)" : "scale(0.9)",
                  opacity: open ? 1 : 0,
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {overflowButtons.map((btn, idx) => (
                  <TemplateButton
                    key={idx}
                    onClick={() => handleButtonClick(btn)}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      {getButtonIcon(btn.type)} {btn.text}
                    </Box>
                  </TemplateButton>
                ))}
                <TemplateButton onClick={handleClose} sx={{ color: "#ef5350" }}>
                  Cancel
                </TemplateButton>
              </Box>
            </Box>
          )}
        </>
      )}
    </TemplateButtonBox>
  );
};

export default ButtonComponent;
