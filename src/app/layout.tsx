import "./globals.css";
import ReactQueryProvider from "../../utils/Provider";
import { AuthContextProvider } from "../../contexts/AuthContext";
import ToastProvider from "../../components/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <ReactQueryProvider>
            <AuthContextProvider>{children}</AuthContextProvider>
          </ReactQueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
