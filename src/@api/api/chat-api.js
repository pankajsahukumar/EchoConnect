import { apiClient } from "../utils/apiClient";

export default{
    async getChats() {
       
        const res = await apiClient.get("/api/get/chats");
        return res;
      },

      async getDocumentUploadUrl(params){
        const res=await apiClient.get("/api/get/url",params)
      }
}