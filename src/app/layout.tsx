import "./globals.css";
import ReactQueryProvider from "../../utils/Provider";
import { AuthContextProvider } from "../../contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthContextProvider>
            {children}
            <Toaster position="top-center" />
          </AuthContextProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
