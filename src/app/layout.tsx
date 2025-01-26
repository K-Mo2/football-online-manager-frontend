import "./globals.css";
import ReactQueryProvider from "../../utils/Provider";
import { AuthContextProvider } from "../../contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
