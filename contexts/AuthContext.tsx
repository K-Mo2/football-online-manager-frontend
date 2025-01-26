"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRefreshToken } from "../hooks/useAuth";
import toast from "react-hot-toast";
import apiClient from "../lib/axios";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: unknown | null;
  loginHandler: (tokens: Tokens, userData: unknown) => void;
  logoutHandler: () => void;
  refreshTokenHandler: (tokens: Tokens) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<unknown | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const refreshTokenFn = useRefreshToken(refreshTokenHandler);

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (accessToken && userData) {
        setIsAuthenticated(true);
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }

      if (pathname != "/login" && (!accessToken || !userData)) {
        throw new Error("Invalid authentication");
      }
    } catch (error) {
      // Handle the error gracefully
      console.log("Error parsing user data:", error);
      toast.error(error);
      // Clear potentially corrupted data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [pathname]);

  useEffect(() => {
    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status == 401) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              refreshTokenFn.mutate(refreshToken);
            }
          } catch (error) {
            console.log(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const loginHandler = function (tokens: Tokens, userData: unknown) {
    try {
      if (tokens && userData) {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logoutHandler = function () {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  function refreshTokenHandler(tokens: Tokens) {
    try {
      if (tokens) {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loginHandler,
        logoutHandler,
        refreshTokenHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthCtx = () => useContext(AuthContext);
