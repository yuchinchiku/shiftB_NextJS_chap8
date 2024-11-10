import type { Metadata } from "next"
import Header from "./_components/Header"
import "../styles/globals.scss"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <div className='content'>
          {children}
        </div>
      </body>
    </html>
  );
}
