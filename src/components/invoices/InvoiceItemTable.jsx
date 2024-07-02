import React, { useState, useMemo } from "react";
import { advancedTable } from "@/constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import Tooltip from "@/components/ui/Tooltip";
import { useEffect } from "react";
import ApiService from "../../../store/services/api.service";
import { toast } from "react-toastify";

const InvoiceItemTable = ({
  editBlock,
  itemsList,
  setItemsList,
  setInvoiceItem,
  isEdit,
  setIsEdit,
  setEditItemIndex,
  getSingleInvoice,
}) => {
  const COLUMNS = [
    {
      Header: "Description",
      accessor: "description",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Price (USD)",
      accessor: "price",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Quantity",
      accessor: "qty",
      // Cell: (row) => {
      //   return <span className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row?.cell?.value === 1
      //     ? "text-success-500 bg-success-500"
      //     : ""
      //     }
      //               ${row?.cell?.value === 0
      //       ? "text-danger-500 bg-danger-500"
      //       : ""
      //     }
      //                `}>{row?.cell?.value == 1 ? "Verified" : "Unverified"}</span>;
      // },
    },
    {
      Header: "Subtotal",
      accessor: "subtotal",
      // Cell: (row) => {
      //   return <span className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row?.cell?.value === 1
      //     ? "text-success-500 bg-success-500"
      //     : ""
      //     }
      //               ${row?.cell?.value === 0
      //       ? "text-danger-500 bg-danger-500"
      //       : ""
      //     }
      //                `}>{row?.cell?.value == 1 ? "Active" : "InActive"}</span>;
      // },
    },
    {
      Header: "Discount %",
      accessor: "discount",
      Cell: (row) => {
        return <span>{row?.cell?.value}%</span>;
      },
    },
    {
      Header: "VAT %",
      accessor: "tax_applied",
      Cell: (row) => {
        return <span>{row?.cell?.value}%</span>;
      },
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },

    {
      Header: "action",
      accessor: "uuid",
      Cell: (row) => {
        if (!editBlock) {
          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Tooltip
                content="Edit"
                placement="top"
                arrow
                animation="shift-away"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={(e) => editItem(row?.cell?.row)}
                >
                  <Icon icon="heroicons:pencil-square" />
                </button>
              </Tooltip>
              <Tooltip
                content="Delete"
                placement="top"
                arrow
                animation="shift-away"
                theme="danger"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => deleteItem(row?.cell?.row)}
                >
                  <Icon icon="heroicons:trash" />
                </button>
              </Tooltip>
            </div>
          );
        }
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);

  const tableInstance = useTable(
    {
      columns,
      data: itemsList,
      initialState: {
        pageSize: 50,
      },
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  //      METHODS

  const editItem = (row) => {
    setInvoiceItem(row.values);
    setEditItemIndex(row.index);
    setIsEdit(true);
  };

  const deleteItem = (row) => {
    console.log("delete row => ", row);
    if (location.pathname.split("/")[1] === "invoice-edit") {
      // Delete using API

      ApiService.setHeader();
      ApiService.delete(
        `api/internal-invoices/delete-invoice-item`,
        `uuid=${row.values?.uuid}`
      ).then((result) => {
        if (result?.data?._metadata?.outcome === "SUCCESS") {
          toast.success("Invoice item removed successfully.");
          getSingleInvoice();
        }else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
          window.open("/package-expire", "_self");
        } else {
          toast.error(result?.data?.errors[0]);
        }
      });
    } else {
      // Local Delete
      setItemsList((prev) => prev.filter((data, index) => index !== row.index));
    }
  };

  return (
    <>
      <Card noborder>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">All Items</h4>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-y-auto ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className=" table-th "
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default InvoiceItemTable;
