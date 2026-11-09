import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "@fontsource-variable/inter/wght.css";
import "./styles/app.css";
import { SiteLayout } from "./components/layout/SiteLayout.jsx";
import { NotFoundContent } from "./routes/not-found.jsx";

export function Layout({ children }) {
  return (
    <html lang="en-GH">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#200940" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  );
}

export function ErrorBoundary({ error }) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <SiteLayout>
        <NotFoundContent />
      </SiteLayout>
    );
  }
  return (
    <SiteLayout>
      <section className="mx-auto max-w-text px-4 py-16">
        <h1 className="text-h1 font-semibold">Something went wrong</h1>
        <p className="mt-4 text-text-secondary">
          Please reload the page.{" "}
          <a className="font-medium text-primary-text underline" href="/">
            Go to the home page
          </a>
        </p>
      </section>
    </SiteLayout>
  );
}
