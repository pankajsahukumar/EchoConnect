import styled from "styled-components";

const ImageWrapper = styled("img")({
    width: "100%",
    height: "auto",
    maxHeight: "350px",
    objectFit: "cover",
    borderRadius: "7.5px",
    paddingLeft: "2px",
    paddingRight: "2px",
  });

  const HeaderImage=({link,alt_text=""})=>{
    return <ImageWrapper src={link} alt_text={alt_text} />
  }
export default HeaderImage;
