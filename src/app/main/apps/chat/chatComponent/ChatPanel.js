import { Suspense, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatHandler from "./ChatHandler";
import MessageSender from "./MessageSender";
import OverlayContainer from "./OverlayContainer";
import { selectOverlay, toggleDocumentOverlay, toggleTemplatePanelOverlay } from "../store/overlaySlice";
import { useChats } from "src/hooks/useChat";
import { useParams } from "react-router-dom";
import { selectContactByMobile } from "../store/contactsSlice";
import TemplateDialog from "../chat/components/TemplateDialog";

const ChatPanel = (props) => {
  const parentRef = useRef(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const dispatch = useDispatch();

  const {isLoading} =useChats();
  const routeParams = useParams();
  const contactMobile = routeParams.id;

  const contact = useSelector((state) =>
    selectContactByMobile(state, contactMobile)
  );
  console.log("Chats in ChatPanel:", isLoading);
  const { DocumentOverlayIsOpen,templateOverlayIsOpen } = useSelector(selectOverlay);
  return (
    <div className="h-full w-full">
      <div ref={parentRef} className="flex h-full w-full flex-col">
        {/* <MessageSender /> */}
        {/* <ChatPanelHeader receiver={chat_receiver} for_other chat_id={id} />
      <Suspense fallback={<FallBackLoadingSpinner />}> */}
        {/* overlay container */}
        {isLoading }
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
                // onSend={handleSendTemplate}
              />
      </div>
    </div>
  );
};

export default ChatPanel;
