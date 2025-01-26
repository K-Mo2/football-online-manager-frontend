// import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return (
    <>
      {children}
      <div suppressHydrationWarning>
        {/* {isClient && <Toaster position="top-center" />} */}
        <Toaster position="top-center" />
      </div>
    </>
  );
}
