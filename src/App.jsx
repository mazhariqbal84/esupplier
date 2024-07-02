import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// home pages  & dashboard
//import Dashboard from "./pages/dashboard";
const Ecommerce = lazy(() => import("./pages/dashboard/ecommerce"));
const CategoryList = lazy(() =>
  import("./pages/category/categories/CategoryList")
);
const BrandList = lazy(() => import("./pages/brand/brands/BrandList"));
const AttributeList = lazy(() =>
  import("./pages/attribute/attributes/BrandList")
);
const ProductList = lazy(() => import("./pages/product/products/ProductList"));
const Login = lazy(() => import("./pages/auth/login"));
import Loading from "@/components/Loading";

import Layout from "./layout/Layout";

function App() {
  return (
    <main className="App  relative">
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route path="/*" element={<Layout />}>
          <Route path="dashboard" element={<Ecommerce />} />
          <Route path="category" element={<CategoryList />} />
          <Route path="brand" element={<BrandList />} />
          <Route path="product" element={<ProductList />} />
          <Route path="attribute" element={<AttributeList />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
