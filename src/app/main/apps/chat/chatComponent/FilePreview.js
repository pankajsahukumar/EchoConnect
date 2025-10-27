
import { Typography } from '@mui/material';
import React from 'react';


const FilePreview = ({ type, url, name, size, id }) => {
  return (
    <div className={`mx-auto flex h-full w-full place-items-center justify-center `}>
      {type ? (
        <>
          {type === 'image' || type === 'svg' ? (
            <ImagePreview name={name} size={size} url={url} />
          ) : type === 'video' ? (
            <VideoPreview videoUrl={url } size={size} />
          ) : type === 'pdf' ? (
                <PdfFileGenericPreview name={name} size={size} />
          ) : (
            <GenericFilePreview name={name} size={size} />
          )}
        </>
      ) : (
        <>
          <span className="wi-full text-whatsapp-light-text dark:text-whatsapp-dark-text flex h-full place-items-center justify-center">
            Select a File to Preview
          </span>
        </>
      )}
    </div>
  );
};

export default FilePreview;


const GenericFilePreview = ({ name, size }) => {
  return (
    <div className="relative flex h-64 w-60 flex-col place-items-center justify-center  gap-2 border border-gray-300 dark:border-gray-600">
      <Typography level={4} className="text-center text-sm text-gray-700 whitespace-nowrap px-2" >
        File Preview is not available
      </Typography>
      {/* <div>
        <Image src={'/icons/preview-generic.svg'} height={120} width={80} alt="File" />
      </div> */}
      {/* <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text">{convertFileSizeFromBytes(size)}</span> */}
    </div>
  );
};

const ImagePreview = ({ name, size, url }) => {
    console.log(size,"this is size")
  return (
    <div className="flex flex-col justify-center gap-2">
      {/* <div className="relative flex h-64 w-60 flex-col justify-center gap-2">
        <img src={url ? url : '/icons/preview-generic.svg'} style={{objectFit:"contain"}}  alt={name ? name : 'Preview Thumbnail'} />
      </div> */}
      <img src={url ? url : '/icons/preview-generic.svg'} style={{objectFit:"contain",height:"100%",width:"100%"}}  alt={name ? name : 'Preview Thumbnail'} />
      {/* <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text flex place-items-center justify-center">
        <span className="flex place-items-center justify-center">{convertFileSizeFromBytes(size)}</span>
      </span> */}
    </div>
  );
};

const VideoPreview = ({ videoUrl, size }) => {
  return (
    <div className="relative w-full pb-[45%] text-whatsapp-light-text dark:text-whatsapp-dark-text ">
      <iframe src={videoUrl} allowFullScreen allow='autoplay' className='absolute top-0 left-0 w-full h-full'></iframe>
    </div>
  );
};

const PdfFileGenericPreview= ({ name, size }) => {
  return (
    <div className="relative flex h-64 w-60 flex-col place-items-center justify-center  gap-2 border border-gray-300 dark:border-gray-600">
      <Typography level={4} className="text-center text-sm text-gray-700 whitespace-nowrap px-2" >
        File Preview is not available
      </Typography>
      {/* <div>
        <Image src={'/icons/generic-pdf.svg'} height={120} width={80} alt="File" />
      </div> */}
      {/* <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text">{convertFileSizeFromBytes(size)}</span> */}
    </div>
  );
};
