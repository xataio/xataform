import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { LinkProps } from "next/link";

import { trpc } from "../utils/trpc";

import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import { Route } from "nextjs-routes";

const publicPages: string[] = [
  "/",
  "/404",
  "/form/[formId]",
] satisfies Route["pathname"][];

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const isPublicPage = publicPages.includes(pathname);

  return (
    <>
      <ClerkProvider {...pageProps}>
        {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        )}
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer position="bottom-right" />
      </ClerkProvider>
    </>
  );
}

export default trpc.withTRPC(App);
