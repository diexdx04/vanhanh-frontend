import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { instance } from "./instance";

const useApi = () => {
  const router = useRouter();

  const getToken = () => {
    return localStorage.getItem("token");
  };
  const getRefreshToken = () => {
    return Cookies.get("refreshToken");
  };
  const refreshAccessToken = async () => {
    console.log("refreshtoken", 777777777777);
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.log("khong co refeshToken");
      throw new Error("Khong co refreshToken");
    }
    try {
      const response = await instance.post("/auth/refresh-token", {
        refreshToken,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      return token;
    } catch (error) {
      console.error("KHong the lam moi token", error);
      throw new Error("Khong the lam moi token");
    }
  };

  const api = async (method: string, url: string, data: object) => {
    const accessToken = getToken();
    if (accessToken) {
      instance.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    try {
      const response = await instance({
        method,
        url,
        data,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { errorCode } = error.response.data;
        if (errorCode === "TOKEN_EXPIRED") {
          try {
            const newToken = await refreshAccessToken();
            instance.defaults.headers["Authorization"] = `Bearer ${newToken}`;

            const retryResponse = await instance({
              method,
              url,
              data,
            });
            return retryResponse.data;
          } catch (refreshError) {
            console.error("KHong the lam moi token", refreshError);
            router.push("/auth/signin");
          }
        }
      }
      throw error;
    }
  };
  return { api };
};

export default useApi;
