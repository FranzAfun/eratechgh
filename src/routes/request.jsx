import { Outlet, useLocation } from "react-router";
import { RequestForm } from "../components/request/RequestForm.jsx";
import { SERVICE_SLUGS } from "../lib/request-rules.js";

export default function Request() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/\/+$/, "").split("/")[2] ?? "";
  const service = SERVICE_SLUGS.includes(slug) ? slug : null;
  return (
    <>
      <RequestForm service={service} />
      <Outlet />
    </>
  );
}
