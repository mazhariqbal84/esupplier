import React from "react";
import Card from "@/components/ui/Card";
import ProductList from "./products/ProductList";

const ManageProducts = () => {
  return (
    <div className=" space-y-5">
      <ProductList />
    </div>
  );
};

export default ManageProducts;
