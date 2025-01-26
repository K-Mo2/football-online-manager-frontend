"use client";
import { useState, useEffect } from "react";
import { useRegister, useLogin } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuthCtx } from "../../../contexts/AuthContext";
import AlertComponent from "../../../components/AlertComponent";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const { isAuthenticated } = useAuthCtx();
  const register = useRegister();
  const login = useLogin();
  const router = useRouter();
  const pathname = usePathname();
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    if (register.isError) {
      setAlert({
        type: "error",
        message: register.error?.response?.data?.message || error.message,
      });
    }

    if (register.isSuccess) {
      setAlert({
        type: "success",
        message: "Registered Successfully! Sign in please!",
      });
    }

    if (login.isError) {
      setAlert({
        type: "error",
        message: login.error?.response?.data?.message || error.message,
      });
    }

    if (login.isSuccess) {
      setAlert({ type: "success", message: "Signed in Successfully!" });
    }
  }, [
    login.isError,
    login.error,
    login.isSuccess,
    register.isError,
    register.error,
    register.isSuccess,
  ]);

  useEffect(() => {
    if (isAuthenticated && pathname == "/login") {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegister) {
      login.mutate({ email, password });
    }
    if (isRegister) {
      register.mutate({ email, password });
      setIsRegister(true);
    }
  };

  return (
    <div className="mt-24 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {alert.message.length > 0 && (
        <AlertComponent alertType={alert.type} message={alert.message} />
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Football Online Manager
        </h2>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-row items-center justify-center my-5">
        <div
          onClick={() => setIsRegister(false)}
          className={`flex-1 items-center justify-center text-center text-xl/9 font-bold tracking-tight rounded cursor-pointer p-1 m-1 ${
            !isRegister
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-900 border"
          }`}
        >
          Sign in
        </div>
        <div
          onClick={() => setIsRegister(true)}
          className={`flex-1 items-center justify-center text-center text-xl/9 font-bold tracking-tight rounded cursor-pointer p-1 m-1 ${
            isRegister
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-900 border"
          }`}
        >
          Register
        </div>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
                value={email}
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                value={password}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={login.isPending}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {login.isPending
                ? "Logging in..."
                : isRegister
                ? "Register"
                : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
