import axios from "axios";

const instance = axios.create ({
    baseURL: "http://307w123.e2.mars-hosting.com/api/",
    // obavezno vrati "api/" posle com/, kad završiš test
});

export default instance;


