import type { Metadata } from "next";
import "@/styles/globals.css";
import NavMobile from "@/components/NavMobile";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import AuthContext from "@/lib/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Providers from "@/components/Providers";
export const metadata: Metadata = {
  title: "Real.",
  description: "Socialmedia web application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <body className="dark:bg-black font-primary bg-background  text-dark dark:text-background">
        <Providers>
          <AuthContext>
            <div className="px-[15px] md:px-0">
              <NavMobile />
              <div className="my-[100px] md:pl-[80px]  w-full h-full flex items-center justify-center ">
                {children}
              </div>
            </div>
            <Navbar />
            <Toaster />
          </AuthContext>
        </Providers>
      </body>
    </html>
  );
}
