import { Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatHandler from "./ChatHandler";
import MessageSender from "./MessageSender";
import OverlayContainer from "./OverlayContainer";
import { selectOverlay, toggleDocumentOverlay } from "../store/overlaySlice";

const ChatPanel = (props) => {
  const parentRef = useRef(null);

  const dispatch = useDispatch();

    const { DocumentOverlayIsOpen } = useSelector(selectOverlay);

  //   const { id, chat_receiver } = useSelector((state: RootState) => state.ChatSlice);
  return (
    <div className="h-full w-full">
      <div ref={parentRef} className="flex h-full w-full flex-col">

      {/* <MessageSender /> */}
        {/* <ChatPanelHeader receiver={chat_receiver} for_other chat_id={id} />
      <Suspense fallback={<FallBackLoadingSpinner />}> */}
        {/* overlay container */}
        <OverlayContainer parentRef={parentRef} isOpen={DocumentOverlayIsOpen} onClose={() => dispatch(toggleDocumentOverlay())}/>

        <ChatHandler />

        <MessageSender />
      </div>
    </div>
  );
};

export default ChatPanel;
