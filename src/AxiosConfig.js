import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000/api"; // Development base url
//axios.defaults.baseURL = "https://edu.gozerolabs.com/api";  //Production base url
axios.defaults.headers.common["Access-Control-Allow-Credentials"] = "true";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["withCredentials"] = true;
export default axios;
