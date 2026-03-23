import axiosRequest from "./axiosRequest";

export const apiClient = {
  get: (url, params = {}, config = {}) => axiosRequest.get(url, { params, ...config }),
  post: (url, data, config = {}) => axiosRequest.post(url, data, config),
  put: (url, data, config = {}) => axiosRequest.put(url, data, config),
  delete: (url, config = {}) => axiosRequest.delete(url, config),
};
