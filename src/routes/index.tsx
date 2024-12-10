import React from "react";
import About from "src/modules/common/pages/About";
import NotFound from "src/modules/common/pages/NotFound";
import Dashboard from "src/modules/hits/pages/Dashboard";

export type Route = {
  path: string;
  element: React.ReactNode;
  anonOnly?: boolean;
  authOnly?: boolean;
};
const routes: Route[] = [
  { element: <About />, path: "/" },
  { element: <Dashboard />, path: "/dashboard" },
  { element: <NotFound />, path: "/*" },
];

export default routes;
