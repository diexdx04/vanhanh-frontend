import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { instance } from "./instance";

const useApi = () => {
  const router = useRouter();

  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const getRefreshToken = (): string | null => {
    const refreshToken = Cookies.get("refreshToken");
    return refreshToken !== undefined ? refreshToken : null;
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      const response = await instance.post("/auth/refresh-token", {
        refreshToken,
      });
      const { token } = response.data.data;
      localStorage.setItem("token", token);
      return token;
    } catch (error) {
      router.push("/signin");
      throw error;
    }
  };

  const api = async (method: string, url: string, data: object) => {
    const token = getToken();
    const refreshToken = getRefreshToken();

    try {
      if (token) {
        instance.defaults.headers["Authorization"] = `Bearer ${token}`;
      } else if (refreshToken) {
        const newToken = await refreshAccessToken();
        instance.defaults.headers["Authorization"] = `Bearer ${newToken}`;
      } else {
        router.push("/signin");
        return;
      }

      const response = await instance({
        method,
        url,
        data,
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        const errorCode = error.response.data.message;

        if (errorCode === "TOKEN_EXPIRED") {
          try {
            const newToken = await refreshAccessToken();
            instance.defaults.headers["Authorization"] = `Bearer ${newToken}`;

            const retryResponse = await instance({
              method,
              url,
              data,
            });
            return retryResponse.data.data;
          } catch (error) {
            console.log(error);
            router.push("/signin");
          }
        }
      } else {
        router.push("/signin");
      }
    }
  };

  return { api };
};

export default useApi;
