import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Impact from "./pages/Impact";
import Loader from "./components/common/Loader";
import ProductPage from "./pages/Product";
import ContactPage from "./pages/Contact";
import BlogPage from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";

import AdminLayout from "./components/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import WebsiteContentPage from "./pages/admin/WebsiteContentPage";
import BlogAdminPage from "./pages/admin/BlogAdminPage";
import BlogEditorPage from "./pages/admin/BlogEditorPage";
import ContactMessagesPage from "./pages/admin/ContactMessagesPage";
import SensorData from "./pages/admin/SensorData";
// Wraps the public-facing pages with the site Navbar/Footer.
// Admin pages render outside this so they get their own
// sidebar layout instead of the marketing nav.
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0F1E] text-slate-100 antialiased">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public site ───────────────────────────── */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
            }
          />
          <Route
            path="/impact"
            element={
              <PublicLayout>
                <Impact />
              </PublicLayout>
            }
          />
          <Route
            path="/product"
            element={
              <PublicLayout>
                <ProductPage />
              </PublicLayout>
            }
          />
          <Route
  path="/blog"
  element={
    <PublicLayout>
      <BlogPage />
    </PublicLayout>
  }
/>
<Route
  path="/blog/:slug"
  element={
    <PublicLayout>
      <BlogPostPage />
    </PublicLayout>
  }
/>
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            }
          />

          {/* ── Admin login (no sidebar, no public navbar) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Admin dashboard (own sidebar layout) ────── */}
          <Route
            path="/admin/dashboard/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                  <Route index element={<DashboardHome />} />
<Route path="content/*" element={<WebsiteContentPage />} />
<Route path="blog" element={<BlogAdminPage />} />
<Route path="blog/new" element={<BlogEditorPage />} />
<Route path="blog/:id" element={<BlogEditorPage />} />
<Route path="messages" element={<ContactMessagesPage />} />
<Route path="sensors" element={<SensorData />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}