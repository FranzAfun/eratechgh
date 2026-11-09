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
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="mx-auto max-w-text px-4 py-16">
      <h1 className="text-h1 font-semibold">
        {notFound ? "Page not found" : "Something went wrong"}
      </h1>
      <p className="mt-4 text-text-secondary">
        {notFound ? "This page doesn't exist." : "Please reload the page or try again later."}{" "}
        <a className="font-medium text-primary-text underline" href="/">
          Go to the home page
        </a>
      </p>
    </main>
  );
}
