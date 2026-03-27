import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatHandler from "./ChatHandler";
import MessageSender from "./MessageSender";
import OverlayContainer from "./OverlayContainer";
import ChatHeader from "./ChatHeader";
import { selectOverlay, toggleDocumentOverlay, toggleTemplatePanelOverlay } from "../store/overlaySlice";
import { useChats } from "src/hooks/useChat";
import TemplateDialog from "../chat/components/TemplateDialog";

const ChatPanel = (props) => {
  const parentRef = useRef(null);
  const dispatch = useDispatch();

  const { isLoading } = useChats();
  const { DocumentOverlayIsOpen, templateOverlayIsOpen } = useSelector(selectOverlay);

  return (
    <div className="h-full w-full">
      <div ref={parentRef} className="flex h-full w-full flex-col">
        {/* Chat header with name, tags, bot info, close & info buttons */}
        <ChatHeader />

        {/* overlay container */}
        <OverlayContainer
          parentRef={parentRef}
          isOpen={DocumentOverlayIsOpen}
          onClose={() => dispatch(toggleDocumentOverlay())}
        />

        <ChatHandler />

        <MessageSender />

        <TemplateDialog
          open={templateOverlayIsOpen}
          onClose={() => dispatch(toggleTemplatePanelOverlay())}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
