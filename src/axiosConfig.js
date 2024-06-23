import  axios from "axios"

const axiosBase = axios.create({
    // baseURL: "http://localhost:1234/api",
    baseURL: "https://evangadi-forum-back-end-deploy-5.onrender.com/api",
})

export default axiosBase