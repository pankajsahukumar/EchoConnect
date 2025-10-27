import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import {
    addAttachedMessage,
  addFileToPreview,
  addLoadedFiles,
  resetFiles,
  selectFiles,
} from "../store/filesSlice";
import { useSelector } from "react-redux";
import SelectedFiles from "./SelectedFiles";
import FilePreview from "./FilePreview";
import { FilesUtils } from "@fuse/utils";
import { closeOverlay } from "../store/overlaySlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Icon, IconButton } from "@mui/material";
import MessageInputV2 from "./MessgeInputV2";
import { Box } from "@mui/system";

const OverlayContainer = ({ parentRef, isOpen, onClose }) => {
  const { files, from, fileToPreview, loadedFiles } = useSelector(selectFiles);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.style.position = "relative";
    }
  }, [parentRef]);

  useEffect(() => {
    const getFilesThumbnailAndValidateThem = async () => {
      try {
        setIsLoading(true);
        const loadedFiles = await FilesUtils.validateFilesAndGetThumbnails(
          files,
          from,
          { height: 264, width: 264 }
        );
        if (loadedFiles) {
          dispatch(addLoadedFiles({ loadedFiles }));
        }
        const firstFile = loadedFiles[0];
        dispatch(
          addFileToPreview({
            id: firstFile.id,
            name: firstFile.file.name,
            size: firstFile.file.size,
            type: firstFile.type,
            url: firstFile.url,
            attachedMessage: null,
          })
        );
      } catch (error) {
        // toast.error('There is an Error while loading files...');
        console.log("Error while loading files", error);
        dispatch(closeOverlay());
      } finally {
        setIsLoading(false);
      }
    };

    if (files.length !== 0) {
      getFilesThumbnailAndValidateThem();
    }
  }, [files, from, dispatch]);

  const handleOnClose = () => {
    onClose();
    dispatch(resetFiles());
  };

    const handleMessageChange = (e) => {
      dispatch(addAttachedMessage(e.target.value))
    }

    const getLoadedFileAttachedMessage = (id) => {

      const attachedMessage = loadedFiles.find(file => file.id === id)
      return attachedMessage?.attachedMessage
    }

  return (
    <AnimatePresence key={"overlay-container"}>
      {isOpen ? (
        <motion.div
          className={`absolute z-30 flex h-full w-full flex-col overflow-hidden px-2 bg-white`}
        >
          <>
            <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text relative flex h-11 flex-shrink-0 place-items-center justify-between px-4 py-2">
              <IconButton onClick={handleOnClose}>
                <FuseSvgIcon size={16} color="action">
                  heroicons-outline:x
                </FuseSvgIcon>
              </IconButton>
              <span className="flex flex-shrink-0 flex-grow justify-center">
                {fileToPreview.name ? fileToPreview.name : "Selected File"}
              </span>
            </span>

            <div className="h-full w-full">
              <FilePreview {...fileToPreview} />
            </div>
            <div className="mx-auto my-2 w-[70%]">
                {/* <MessageInput placeholder="Type message" key={fileToPreview.id} value={getLoadedFileAttachedMessage(fileToPreview.id) || ""} onChange={handleMessageChange} /> */}
                <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "5px 8px 5px 12px",
          border: "1px solid #e4e6ea",
        }}
      >
             <MessageInputV2 value={getLoadedFileAttachedMessage(fileToPreview.id) || ""} onChange={handleMessageChange}/>
             </Box>
              </div>
            <SelectedFiles />
          </>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default React.memo(OverlayContainer);
