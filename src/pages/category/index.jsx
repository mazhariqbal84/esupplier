import React from "react";
import Card from "@/components/ui/Card";
import CategoryList from "./categories/CategoryList";

const ManageCategories = () => {
  return (
    <div className=" space-y-5">
      <CategoryList />
    </div>
  );
};

export default ManageCategories;
