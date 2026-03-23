import React from "react";
import { useDispatch } from "react-redux";
import { removeFile } from "../store/filesSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

export const Thumbnail = ({
  url,
  height,
  width,
  active,
  onClick,
  type,
  id,
}) => {
  const dispatch = useDispatch();

  const handleRemove = (e, id) => {
    e.stopPropagation();
    dispatch(removeFile({ id }));
  };

  return (
    <div
      onClick={onClick}
      style={{ height, minWidth: width }}
      className={`group relative flex place-items-center justify-center overflow-hidden border hover:cursor-pointer ${
        active
          ? " border-whatsapp-misc-my_message_bg_dark rounded-lg border-[3px]"
          : "rounded-md border-[1px] border-gray-500  dark:border-gray-600"
      }`}
    >
      <span className="invisible absolute -bottom-[100%] z-10  h-full w-full overflow-hidden bg-gray-600 bg-opacity-50 group-hover:visible group-hover:top-0" />

      <span
        className="group invisible absolute right-0 top-0 z-20 h-5 w-5 group-hover:visible"
        onClick={(e) => handleRemove(e, id)}
      >
        <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
      </span>
      {url ? (
        <>
          {type === "image" ? (
            <ImageThumbnail url={url} />
          ) : type === "video" ? (
            <VideoThumbnail url={url} />
          ) : (
            <ImageThumbnail url={url} />
          )}
        </>
      ) : type === "pdf" ? (
        <GenericPDFThumbnail />
      ) : (
        <GenericThumbnail />
      )}
    </div>
  );
};

const ImageThumbnail = ({ url }) => {
  return (
    <span>
      <img
        src={url}
        alt="Thumbnail"
        style={{ height: "30px", width: "30px", objectFit: "contain" }}
        className="relative"
      />
    </span>
  );
};

const VideoThumbnail = ({ url }) => {
  let thumbnailUrl = url;
  if (url instanceof Blob) {
    thumbnailUrl = URL.createObjectURL(url);
  }

  return (
    <span className="flex place-items-center justify-center">
      <img
        src={url}
        alt="Thumbnail"
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
        className="relative"
      />
      <span className="absolute top-0 flex h-full w-full place-items-center justify-center bg-black bg-opacity-30">
        <span className="relative h-5 w-5">
          <img
            src={url}
            alt="Thumbnail"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
            className="relative"
          />
        </span>
      </span>
    </span>
  );
};

const GenericThumbnail = () => {
  return (
    <span>
      {/* <Image src={'/icons/preview-generic.svg'} alt="Thumbnail" height={30} width={30} className="relative" /> */}
      <img
        src={url}
        alt="Thumbnail"
        style={{ height: "30", width: "30", objectFit: "cover" }}
        className="relative"
      />
    </span>
  );
};

const GenericPDFThumbnail = () => {
  return (
    <span>
      <img
        src={url}
        alt="Thumbnail"
        style={{ height: "30", width: "30", objectFit: "cover" }}
        className="relative"
      />
    </span>
  );
};
