import React, { useState, useEffect } from "react";
import {
  setItemsPerPage,
  setCurrentPage,
  setGlobalSearch,
} from "@/pages/invoice/store/store";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { useLocation, useNavigate } from "react-router-dom";
import GlobalFilter from "@/pages/invoice/invoice/GlobalFilter";
import Pagination from "@/components/ui/Pagination";
import { useSelector, useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import CryptoJS from "crypto-js";

const InvoiceTable = ({
  title,
  columns,
  invoiceData,
  handlePaginationChange,
  setModalName,
  setSelectedInvoices,
  deleteConfirmAll,
  searchRequest,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { globalSearch } = useSelector((state) => state.invoices);
  const { itemsPerPage } = useSelector((state) => state.invoices);
  const { currentPage } = useSelector((state) => state.invoices);
  const [totalPages, setTotalPages] = useState(
    invoiceData.total / itemsPerPage
  );
  const [globalFilterInput, setGlobalFilterInput] = useState("");
  const [deleteAllOption, setDeleteAllOption] = useState("");
  const [userPermission, setUserPrmission] = useState(
    JSON.parse(
      sessionStorage.getItem("permission") &&
        CryptoJS.AES.decrypt(
          sessionStorage.getItem("permission"),
          "secretKey"
        ).toString(CryptoJS.enc.Utf8)
    )
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setPageSize(itemsPerPage);
    setTotalPages(invoiceData.total / itemsPerPage);
  }, [itemsPerPage]);

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    dispatch(setCurrentPage(page));
  };
  const searchRequestButton = () => {
    dispatch(setGlobalSearch(globalFilterInput));
    searchRequest(false);
  };
  const clearSearch = () => {
    setGlobalFilterInput("");
    dispatch(setGlobalSearch(""));
    // console.log("globalSearch" + globalSearch);
    searchRequest(true);
  };
  useEffect(() => {
    dispatch(setGlobalSearch(globalFilterInput));
    if (invoiceData.total > itemsPerPage) {
      setTotalPages(invoiceData.total / itemsPerPage);
    } else {
      setTotalPages(1);
    }
  }, [searchRequestButton]);

  const deleteAllInvoice = (event) => {
    deleteConfirmAll(event.target.value);
  };

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return (
        <>
          <input
            type="checkbox"
            ref={resolvedRef}
            {...rest}
            className="table-checkbox"
          />
        </>
      );
    }
  );

  const tableInstance = useTable(
    {
      columns,
      data: invoiceData?.data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
    prepareRow,
    rows,
    setGlobalFilter,
    selectedFlatRows,
    state: { selectedRowIds },
  } = tableInstance;

  const pageSizeSet = (e) => {
    setPageSize(Number(e.target.value));
    dispatch(setItemsPerPage(Number(e.target.value)));
  };

  useEffect(() => {
    var selectedId = selectedFlatRows.map(function (items, index) {
      return items["values"]["uuid"];
    });
    setSelectedInvoices(selectedId);
  }, [selectedFlatRows]);
  const { globalFilter, pageSize } = state;
  const responsiveFunction = (id) => {
    if (id === 3 || id === 4 || id === 5 || id === 7) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div>
      {userPermission.includes("invoice-add") && (
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h4 className="card-title">
            {title} ({invoiceData.total})
          </h4>
          {location?.pathname !== "/orders" && (
            <div className="flex items-center gap-3 ml-auto">
              <Button
                text="+ Add Invoice"
                className="btn-dark btn-sm"
                onClick={() => navigate("/invoice-add")}
              />
            </div>
          )}
        </div>
      )}
      <div className="flex justify-between flex-row-reverse mb-6">
        <div className="flex items-center gap-3">
          <GlobalFilter
            filter={globalSearch}
            setGlobalFilter={setGlobalFilterInput}
          />
          <Button
            text="Search"
            className="btn-success btn-sm"
            onClick={() => searchRequestButton()}
          />
          <Button
            text="Clear"
            className="btn-warning btn-sm"
            onClick={() => clearSearch()}
          />
        </div>
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
                    {headerGroup.headers.map((column, i) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        scope="col"
                        className={` table-th ${
                          responsiveFunction(i) && "lg:table-cell hidden"
                        }`}
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
                {/* // <tr {...row.getRowProps()} className="cursor-pointer" onClick={() => navigate("/invoice-preview/" + row.original.uuid)}> */}
                {page?.length > 0 ? (
                  page?.map((row) => {
                    prepareRow(row);
                    // console.log("All row properties", row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell, i) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className={`${
                                responsiveFunction(i) && "lg:table-cell hidden"
                              } table-td`}
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr className="absolute md:left-[50%]  left-[35%] mt-2">
                    <td className="">☹️ No data Available!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex md:space-y-0 flex-wrap space-y-5 justify-between mt-10 items-center">
        <div className=" flex items-center space-x-3 rtl:space-x-reverse">
          <select
            className="form-control py-2 w-max"
            value={pageSize}
            onChange={(e) => pageSizeSet(e)}
          >
            {[25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Page{" "}
            <span>
              {currentPage} of {invoiceData?.last_page}
            </span>
            {userPermission.includes("invoice-delete-all") && (
              <span>
                {Object.keys(selectedRowIds).length > 0 && (
                  <select
                    value={deleteAllOption}
                    className="form-control py-2 w-max !inline ml-4"
                    onChange={(e) => deleteAllInvoice(e)}
                  >
                    <option value="">--Select--</option>
                    <option value="deleted">Delete All</option>
                  </select>
                )}
              </span>
            )}
          </span>
        </div>
        <Pagination
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default InvoiceTable;
