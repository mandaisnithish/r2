/* Author: Nithish Kaliannan Ananth */
// src/App.tsx
// Routing for the three sub-apps:
//   1. Public site      — inside PublicShell (persistent WebGL Hydro-Field)
//   2. RobotX microsite — nested under /robotx, same shell
//   3. Admin console    — its own layout, lazy chunk, no WebGL
//
// The old 2-second blocking <Loader> is gone: the app renders immediately
// and a ~450 ms non-blocking BootSequence plays once per session.

import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./context/AuthContext";
import { queryClient } from "./lib/queries";
import PublicShell from "./components/layout/PublicShell";
import Home from "./pages/Home";
import RouteFallback from "./components/layout/RouteFallback";

const About = lazy(() => import("./pages/About"));
const Impact = lazy(() => import("./pages/Impact"));
const ProductPage = lazy(() => import("./pages/Product"));
const BlogPage = lazy(() => import("./pages/Blog"));
const BlogPostPage = lazy(() => import("./pages/BlogPost"));
const ContactPage = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const RobotXLayout = lazy(() => import("./pages/robotx/RobotXLayout"));
const RobotXOverview = lazy(() => import("./pages/robotx/Overview"));
const RobotXTeam = lazy(() => import("./pages/robotx/Team"));
const RobotXSystemVehicles = lazy(() => import("./pages/robotx/SystemVehicles"));
const RobotXDesign = lazy(() => import("./pages/robotx/DesignDevelopment"));
const RobotXTesting = lazy(() => import("./pages/robotx/TestingResults"));
const RobotXMedia = lazy(() => import("./pages/robotx/Media"));
const RobotXSponsors = lazy(() => import("./pages/robotx/Sponsors"));
const RobotXContact = lazy(() => import("./pages/robotx/Contact"));

const AdminApp = lazy(() => import("./pages/admin/AdminApp"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            {/* ── Public site + RobotX (one persistent shell) ── */}
            <Route element={<PublicShell />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="impact" element={<Impact />} />
              <Route path="product" element={<ProductPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogPostPage />} />
              <Route path="contact" element={<ContactPage />} />

              <Route path="robotx" element={<RobotXLayout />}>
                <Route index element={<RobotXOverview />} />
                <Route path="team" element={<RobotXTeam />} />
                <Route path="system-vehicles" element={<RobotXSystemVehicles />} />
                <Route path="design" element={<RobotXDesign />} />
                <Route path="testing" element={<RobotXTesting />} />
                <Route path="media" element={<RobotXMedia />} />
                <Route path="sponsors" element={<RobotXSponsors />} />
                <Route path="contact" element={<RobotXContact />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* ── Admin console ── */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<Suspense fallback={<RouteFallback full label="Opening console" />}><AdminLogin /></Suspense>} />
            <Route path="/admin/dashboard/*" element={<Suspense fallback={<RouteFallback full label="Opening console" />}><AdminApp /></Suspense>} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
      <Analytics />
    </BrowserRouter>
  );
}
