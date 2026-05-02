import apiUtil from "../utils/api";
import { PROXY_END_GET_POINT, PROXY_END_POINT } from "@/utils/constants";

export default function useFetch() {
const getApiEndpoint = (url: string) => {
    if (!url) {
     return null;
    }
    return `${process.env.NEXT_PUBLIC_API_BASEURL}${url}`;
};

const postBackend = async (url: string, data = {}, headers?: Headers) => {
    console.log("Data",data)
    return await apiUtil.post(
     `${window.location.origin}${PROXY_END_POINT}`,
     {
        url,
        ...data,
     },
     headers,
    );
};
const getBackend = async (url: string, data = {}, headers?: Headers) => {
    console.log("Data",data)
    return await apiUtil.get(
     `${window.location.origin}${PROXY_END_GET_POINT}`,
     {
        url,
        ...data,
     },
     headers,
    );
};

return {
    getApiEndpoint,
    post: postBackend, //apiUtil.post,
    get: getBackend,
};
}