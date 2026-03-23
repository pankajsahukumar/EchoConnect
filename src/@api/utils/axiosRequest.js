
    import axios from "axios";

    const axiosRequest = axios.create({
      baseURL: "http://127.0.0.1:8090",
      headers: { "Content-Type": "application/json" },
    });
    

    axiosRequest.interceptors.request.use(
      (config) => {
        // Example: attach auth token from localStorage or cookies
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axiosRequest.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            // // if you ever get an unauthorized response, logout the user
            // this.emit('onAutoLogout', 'Invalid access_token');
            // this.setSession(null);
          }
          throw err;
        });
      }
    );

    export default axiosRequest;
