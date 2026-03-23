import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import jwtServiceConfig from './jwtServiceConfig';

/* eslint-disable camelcase */
class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        const originalRequest = err.config;
        
        // If the error is 401 and we haven't already tried to refresh the token
        if (err.response && err.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Try to refresh the token
          return this.refreshToken()
            .then((newAccessToken) => {
              // Update the request with the new token
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              // Retry the request with the new token
              return axios(originalRequest);
            })
            .catch((refreshError) => {
              // If refresh token fails, logout the user
              console.error('Token refresh failed:', refreshError);
              this.emit('onAutoLogout', 'Session expired. Please login again.');
              this.setSession(null);
              throw err;
            });
        }
        
        // For other errors, just throw
        return Promise.reject(err);
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }
    this.setSession(access_token);
    this.emit('onAutoLogin', true);
    // if (this.isAuthTokenValid(access_token)) {
    //   this.setSession(access_token);
    //   this.emit('onAutoLogin', true);
    // } else {
    //   this.setSession(null);
    //   this.emit('onAutoLogout', 'access_token expired');
    // }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      data =Object.assign({}, data, {     "firstName":"Pankaj",
        "lastName":"Sahu",
        "phoneNumber":"+919899960297",
        "organizationId":"org_1234567890" });
      axios.post("http://127.0.0.1:8090"+jwtServiceConfig.signUp, data).then((response) => {
        console.log(response,'this is response');
        if (response.data.user) {
          this.setSession(response.data.access_token);
          resolve(response.data.user);
          this.emit('onLogin', response.data.user);
        } else {
          reject(response.data.error);
        }
      }).catch((error) => {
       // Axios wraps the backend error inside error.response
       if (error.response && error.response.data) {
        reject(error.response.data); // This will contain your CustomError JSON
      } else {
        reject({ message: "Network or server error" });
      }
      });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .get(jwtServiceConfig.signIn, {
          data: {
          email,
          password,
          },
        })
      .then((response) => {
        console.log(response,'this is response');
          if (response.data.user) {
            this.setSession(response.data.access_token);
            resolve(response.data.user);
            this.emit('onLogin', response.data.user);
        } else {
            reject(response.data.error);
        }
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(jwtServiceConfig.accessToken, {
          data: {
            access_token: this.getAccessToken(),
          },
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.access_token);
            resolve(response.data.user);
          } else {
            this.logout();
            reject(new Error('Failed to login with token.'));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error('Failed to login with token.'));
        });
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = (access_token, refresh_token = null) => {
    if (access_token) {
      FuseUtils.setAccessToken(access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
      
      if (refresh_token) {
        FuseUtils.setRefreshToken(refresh_token);
      }
    } else {
      FuseUtils.clearTokens();
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit('onLogout', 'Logged out');
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return FuseUtils.getAccessToken();
  };
  
  getRefreshToken = () => {
    return FuseUtils.getRefreshToken();
  };
  
  refreshToken = () => {
    const refresh_token = this.getRefreshToken();
    
    if (!refresh_token) {
      return Promise.reject(new Error('No refresh token available'));
    }
    
    return new Promise((resolve, reject) => {
      axios
        .post("http://127.0.0.1:8090" + jwtServiceConfig.accessToken, {
          refresh_token
        })
        .then((response) => {
          if (response.data.data && response.data.data.accessToken) {
            this.setSession(response.data.data.accessToken, response.data.data.refreshToken);
            resolve(response.data.data.accessToken);
          } else {
            this.logout();
            reject(new Error('Failed to refresh token'));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error('Failed to refresh token'));
        });
    });
  };
}

const instance = new JwtService();

export default instance;
