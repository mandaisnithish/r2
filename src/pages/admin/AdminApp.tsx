/* Author: Nithish Kaliannan Ananth */
// src/pages/admin/AdminApp.tsx
// Lazy entry for the admin console (TipTap and friends stay out of the
// public bundle). Routes are unchanged from the previous App.tsx.

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import AdminLayout from "../../components/admin/AdminLayout";
import DashboardHome from "./DashboardHome";
import WebsiteContentPage from "./WebsiteContentPage";
import BlogAdminPage from "./BlogAdminPage";
import BlogEditorPage from "./BlogEditorPage";
import ContactMessagesPage from "./ContactMessagesPage";
import SensorData from "./SensorData";

export default function AdminApp() {
  return (
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
  );
}
