import styled from "styled-components";


const VideoWrapper = styled("video")({
    width: "100%",
    height: "auto",
    maxHeight: "500px",
    objectFit: "cover",
    borderRadius: "7.5px",
    paddingLeft: "2px",
    paddingRight: "2px",
  });


  const HeaderVideo=({link,fileName=""})=>{
    if(!link){
        return null;
    }
    return (
        <VideoWrapper>
        <source src={link} type="video/mp4" />
        {fileName}
        </VideoWrapper>
    )
  }

  export default HeaderVideo;