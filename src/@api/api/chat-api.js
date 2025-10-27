import { apiClient } from "../utils/apiClient";

export default{
    async getChats() {
       
        const res = await apiClient.get("/api/chats");
        return res;
      },

      async getDocumentUploadUrl(params){
        const res=await apiClient.get("/api/get/url",params)
      }
}