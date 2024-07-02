import React, { useState, useEffect } from "react";
const TotalTable = ({ invoiceDetails }) => {
  const [vatTax, setVatTax] = useState(0);
  const [subtotalDiscount, setSubtotalDiscount] = useState(0);

  useEffect(() => {
    invoiceDetails?.details?.map(
      (data, index) => (
        setVatTax(data?.tax_applied), setSubtotalDiscount(data?.discount)
      )
    );
  }, []);

  return (
    <div className="md:w-full w-max">
      <table className="md:w-full w-max border-collapse table-fixed dark:border-slate-700 dark:border">
        <thead>
          <tr>
            <th
              colSpan={3}
              className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
            >
              <span className="block px-6 py-5 font-semibold">ITEM</span>
            </th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
              <span className="block px-6 py-5 font-semibold">PRICE</span>
            </th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
              <span className="block px-6 py-5 font-semibold">QTY</span>
            </th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
              <span className="block px-6 py-5 font-semibold">SUBTOTAL</span>
            </th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
              <span className="block px-6 py-5 font-semibold">DISCOUNT</span>
            </th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
              <span className="block px-6 py-5 font-semibold">TAX</span>
            </th>
            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
              <span className="block px-6 py-5 font-semibold">TOTAL</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {invoiceDetails?.details?.map((data, index) => (
            <tr
              key={index}
              className="border-b border-slate-100 dark:border-slate-700"
            >
              <td
                colSpan={3}
                className="text-slate-900 dark:text-slate-300 text-sm md:w-full max-w-[200px]  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4"
              >
                {data?.description}
              </td>
              <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                {data?.price}
              </td>
              <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                {data?.qty}
              </td>
              <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                {data?.price * data?.qty}
              </td>
              <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                {data?.discount}
              </td>
              <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                {data?.tax_applied}
              </td>
              <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                {data?.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex px-6 py-6 items-center">
        <div className="flex-1 text-slate-500 dark:text-slate-300 text-sm"></div>
        <div className="flex-none min-w-[270px] space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
              subtotal:
            </span>
            <span className="text-slate-900 dark:text-slate-300">
              USD {invoiceDetails?.subtotal}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
              Discount Total:
            </span>
            <span className="text-slate-900 dark:text-slate-300">
              {subtotalDiscount} %
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
              Vat:
            </span>
            <span className="text-slate-900 dark:text-slate-300">
              {vatTax} %
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
              Invoice total:
            </span>
            <span className="text-slate-900 dark:text-slate-300 font-bold">
              USD {invoiceDetails?.grand_total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalTable;
