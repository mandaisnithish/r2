// src/pages/admin/webcontent/ProductAdmin.tsx
import { NavLink, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import ProductCoreAdmin from "./product/ProductCoreAdmin";
import ProductImagesAdmin from "./product/ProductImagesAdmin";
import ProductFeaturesAdmin from "./product/ProductFeaturesAdmin";
import ProductSpecsAdmin from "./product/ProductSpecsAdmin";
import ProductStepsAdmin from "./product/ProductStepsAdmin";
import ProductUseCasesAdmin from "./product/ProductUseCasesAdmin";

const ACCENT = "#3B82F6";

const TABS = [
  { to: "/admin/dashboard/content/product/core", label: "Core Product" },
  { to: "/admin/dashboard/content/product/images", label: "Images" },
  { to: "/admin/dashboard/content/product/features", label: "Features" },
  { to: "/admin/dashboard/content/product/specs", label: "Specs" },
  { to: "/admin/dashboard/content/product/steps", label: "Steps" },
  { to: "/admin/dashboard/content/product/usecases", label: "Use Cases" },
];

export default function ProductAdmin() {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate("/admin/dashboard/content")}
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-200 text-sm mb-6 transition-colors group"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Website Content
      </button>

      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${ACCENT}1F`, border: `1px solid ${ACCENT}40`, color: ACCENT }}
        >
          <Package size={16} />
        </div>
        <h1 className="font-heading font-bold text-2xl text-white tracking-tight">Product</h1>
      </div>
      <p className="text-slate-500 text-sm mb-7 ml-12">
        Core product info plus images, features, specs, steps and use cases.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.07] mb-8 overflow-x-auto">
        {TABS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors no-underline border-b-2 -mb-px ${
                isActive ? "text-white" : "text-slate-500 border-transparent hover:text-slate-300"
              }`
            }
            style={({ isActive }) =>
              isActive ? { borderColor: ACCENT, color: ACCENT } : undefined
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index element={<Navigate to="core" replace />} />
        <Route path="core" element={<ProductCoreAdmin />} />
        <Route path="images" element={<ProductImagesAdmin />} />
        <Route path="features" element={<ProductFeaturesAdmin />} />
        <Route path="specs" element={<ProductSpecsAdmin />} />
        <Route path="steps" element={<ProductStepsAdmin />} />
        <Route path="usecases" element={<ProductUseCasesAdmin />} />
      </Routes>
    </div>
  );
}