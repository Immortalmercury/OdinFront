import axios from 'axios';

// const baseURL = process.env.NODE_ENV === "development"
//   ? "http://localhost:3001/"
//   : "http://example.com"

const request = axios.create({
    // baseURL,
    withCredentials: true
})

/* 
  The below is required if you want your API to return 
  server message errors. Otherwise, you'll just get 
  generic status errors.

  If you use the interceptor below, then make sure you 
  return an err message from your express route: 

  res.status(404).json({ err: "You are not authorized to do that." })

*/
request.interceptors.response.use(
    (response) => { return response; },
    (error) => {
        let msg = 'There is an error, open console to see details';
        let status = 'HTTP_EXCEPTION';
        let data = [];
        if (error.response !== undefined && error.response.data.message !== undefined) {
            data = error.response.data;
            msg = error.response.data.message;
            status = error.response.data.exception;
        }
        return Promise.reject({
            success: false,
            status: status,
            message: msg,
            data: data,
        });
    }
)

export default request;