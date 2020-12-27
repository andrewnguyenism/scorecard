import type { AppProps } from "next/app";

import UserProvider from "../context/UserContext";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </UserProvider>
  );
}

export default MyApp;
