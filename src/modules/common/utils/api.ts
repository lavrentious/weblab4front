import axios, { AxiosError } from "axios";

export type ApiError = AxiosError<{ message?: string }>;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// api.interceptors.request.use((config) => {
//   if (config.headers && TokenService.accessToken) {
//     config.headers.Authorization = `Bearer ${TokenService.accessToken}`;
//   }
//   return config;
// });

// function createAxiosResponseInterceptor() {
//   const interceptor = api.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//       if (error.response?.status !== 401 || !TokenService.accessToken) {
//         throw error;
//       }
//       api.interceptors.response.eject(interceptor);
//       return AuthService.refresh()
//         .then(() => {
//           if (error.config) {
//             return api(error.config);
//           }
//         })
//         .finally(createAxiosResponseInterceptor);
//     }
//   );
// }
// createAxiosResponseInterceptor();

export { api };
