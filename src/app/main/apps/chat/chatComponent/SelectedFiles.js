import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFileToPreview, addMoreFiles, selectFiles } from '../store/filesSlice';
import { Thumbnail } from './Thumbnail';
import AddNewFileButton from './AddNewFileButton';
import { IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectCustomer } from '../store/customerSlice';
import { ChatMessageModel } from '@models';
import { addTempMessage, sendMessage } from '../store/chatSlice';


const SelectedFiles = () => {
const [quote, setQuote] = useState(null);
  const { fileToPreview, loadedFiles,from } = useSelector(selectFiles);
 const customer = useSelector(selectCustomer);
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const selectFileTOPreview = (fileToPreview) => {
    dispatch(addFileToPreview({ ...fileToPreview }))

  };
  
  const handleSendMessages = async () => {
    console.log("Sending files:", loadedFiles);
    try {
      setIsLoading(true)
     let mediaMessages=[];
     mediaMessages = loadedFiles.map((f) => {
        // const response = await apiClient.get("/api/get/url", {
        //   fileName: file.name,
        //   fileType: file.type,
        // });

        // const { signedUrl, fileUrl } = response.data;
        // // 2. Upload directly to S3
        // await fetch(signedUrl, {
        //   method: "PUT",
        //   headers: {
        //     "Content-Type": file.type,
        //   },
        //   body: file,
        // });
        // // 3. Store both local preview + remote S3 URL
        // const uploadedFile = {
        //   fileType: fileType,
        //   fileUrl:fileUrl,
        //   mimeType: file.type,
        //   size: file.size,
        //   fileName: file.name,
        //   preview:URL.createObjectURL(file)
        // };
        let messagetType="document";
        if(from!=="document"){
            messagetType=f.type;
        }
        let message = {
          messageType: messagetType,
          fileUrl:f.url,
          caption: f.attachedMessage,
          mimeType: f.mime,
          size: Math.trunc(f.file.size),
          fileName: f.original_name,
        };
        const messageData = new ChatMessageModel(
          customer.chatId,
          message,
          quote ? quote.id : null,
          customer
        );
        return messageData;
      });
        mediaMessages.map(async (message) => {
        dispatch(addTempMessage(message.toTempMessage(quote)));
        console.log("Prepared message:", message);
        // const resultAction = await dispatch(sendMessage(message));
      });
      dispatch(closeOverlay());
    } catch (error) {
        console.log("Error while uploading files", error);
    //   toast.error("Error While uploading Files", { position: "bottom-left" })
    } finally {
      setIsLoading(false)
    }

  }
  const handleAddFileChange = (e) => {
    if (e.target.files) {
      dispatch(addMoreFiles(e.target.files))
    }
  }

  return (
    <div className='flex place-items-start gap-2 py-2 px-3' >
      <div className="relative flex place-items-center w-full gap-2 overflow-y-scroll scrollbar">
        {loadedFiles.map((file) => {
          return (
            <Thumbnail
              id={file.id}
              key={file.id}
              height={50}
              width={50}
              type={file.type}
              url={file.type === 'video' ? (file.thumbnail) : file.url}
              active={fileToPreview.id === file.id}
              onClick={() => selectFileTOPreview({ id: file.id, name: file.file.name, size: file.file.size, type: file.type, url: file.url, attachedMessage: file?.attachedMessage})}
            />
          );
        })}
      </div>
      <div className='flex place-items-center gap-2 '>
        <AddNewFileButton onChange={handleAddFileChange} />
        <IconButton
          type="submit"
          sx={{
            width: 40,
            height: 40,
            backgroundColor: "#00a884",
            color: "#fff"
          }}
          onClick={handleSendMessages}
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


