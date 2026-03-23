import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  MenuItem,
} from "@mui/material";
import { useRef } from "react";


const AttachmentOptionFile = ({
  iconSrc,
  title,
  acceptedTypes,
  fromType,
  ...props
}) => {
  const fileInputRef = useRef(null);
  const onClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <>
      <input
        ref={fileInputRef}
        className="hidden"
        id={fromType}
        type="file"
        accept={acceptedTypes?.join(",")}
        {...props}
      />
      <MenuItem onClick={onClick}>
        <FuseSvgIcon className="mr-2">{iconSrc}</FuseSvgIcon>
       {title}
      </MenuItem>
    </>
  );
};
export default AttachmentOptionFile;