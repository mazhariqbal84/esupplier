import React from "react";
import Card from "@/components/ui/Card";
import InvoiceList from "./invoice/InvoiceList";

const ManageInvoices = () => {
  return (
    <div className=" space-y-5">
      <InvoiceList />
    </div>
  );
};

export default ManageInvoices;
