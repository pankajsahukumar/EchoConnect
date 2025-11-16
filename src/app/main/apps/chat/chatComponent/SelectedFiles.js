import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFileToPreview,
  addMoreFiles,
  selectFiles,
} from "../store/filesSlice";
import { Thumbnail } from "./Thumbnail";
import AddNewFileButton from "./AddNewFileButton";
import { IconButton } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { selectCustomer } from "../store/customerSlice";
import { ChatMessageModel } from "@models";
import { addTempMessage, sendMessage } from "../store/chatSlice";
import { apiClient } from "src/@api/utils/apiClient";
import { closeOverlay } from "../store/overlaySlice";
import { height, width } from "@mui/system";

const SelectedFiles = () => {
  const [quote, setQuote] = useState(null);
  const { fileToPreview, loadedFiles, from } = useSelector(selectFiles);
  const customer = useSelector(selectCustomer);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const selectFileTOPreview = (fileToPreview) => {
    dispatch(addFileToPreview({ ...fileToPreview }));
  };
  const fetchSignedUrl = async (fileName, fileType) => {
    const response = await apiClient.post("/api/v1/files/upload-url", {
      fileName: fileName,
      fileType: fileType,
      extension: ".png",
    });
    return response;
  };
  const handleSendMessages = async () => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      const mediaMessages = await Promise.all(
        loadedFiles.map(async (f) => {
          console.log("Uploading file:", f);
          const result = await fetchSignedUrl(f.original_name, f.mime);
          const { signedUrl, fileUrl } = result.data.data;
          await fetch(signedUrl, {
            method: "PUT",
            headers: { "Content-Type": f.mime },
            body: f.file,
          });

          let messagetType = from !== "document" ? f.type : "document";
          const message = {
            messageType: messagetType,
            fileUrl,
            caption: f.attachedMessage,
            mimeType: f.mime,
            size: Math.trunc(f.file.size),
            fileName: f.original_name,
            height: f.height,
            width: f.width,
          };

          return new ChatMessageModel(
            customer.id,
            message,
            quote ? quote.id : null,
            customer
          );
        })
      );

      mediaMessages.map(async (message) => {
        dispatch(addTempMessage(message.toTempMessage(quote)));
        const resultAction = dispatch(sendMessage(message));
      });
      dispatch(closeOverlay());
    } catch (error) {
      console.log("Error while uploading files", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddFileChange = (e) => {
    console.log("Files added:", e.target.files);
    if (e.target.files) {
      dispatch(addMoreFiles(e.target.files));
    }
  };

  return (
    <div className="flex place-items-start gap-2 py-2 px-3">
      <div className="relative flex place-items-center w-full gap-2 overflow-y-scroll scrollbar">
        {loadedFiles.map((file) => {
          return (
            <Thumbnail
              id={file.id}
              key={file.id}
              height={50}
              width={50}
              type={file.type}
              url={file.type === "video" ? file.thumbnail : file.url}
              active={fileToPreview.id === file.id}
              onClick={() =>
                selectFileTOPreview({
                  id: file.id,
                  name: file.file.name,
                  size: file.file.size,
                  type: file.type,
                  url: file.url,
                  attachedMessage: file?.attachedMessage,
                })
              }
            />
          );
        })}
      </div>
      <div className="flex place-items-center gap-2 ">
        <AddNewFileButton onChange={handleAddFileChange} />
        <IconButton
          type="submit"
          sx={{
            width: 40,
            height: 40,
            backgroundColor: isLoading ? "#ccc" : "#00a884",
            color: "#fff",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
          onClick={handleSendMessages}
          disabled={isLoading}
        >
          <FuseSvgIcon size={20} sx={{ transform: "rotate(90deg)" }}>
            heroicons-solid:paper-airplane
          </FuseSvgIcon>
        </IconButton>
      </div>
    </div>
  );
};

export default SelectedFiles;
