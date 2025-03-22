import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { Inter, Poppins } from "next/font/google";

// Optional Inter font if you want to use it elsewhere
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "My App",
  description: "Portfolio Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      {/* 👇 All text will now default to Poppins */}
      <body className="font-sans">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
