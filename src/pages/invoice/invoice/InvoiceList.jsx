import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import {
  removeInvoicesError,
  setInvoicesErrors,
  setInvoices,
  updateInvoice,
  setCurrentPage,
} from "../store/store";
import { ON_LOADING } from "@/store/loader";
import Loader from "@/components/Loader";
import { useSelector, useDispatch } from "react-redux";
import InvoiceTable from "@/components/ui/invoices/InvoiceTable";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import Confirmation from "@/components/ui/Confirmation";
import Button from "@/components/ui/Button";
import {
  setactiveModal,
  setdeleteConfrim,
  setDeleteAll,
} from "@/store/services/common/confirmation.module";
import { deleteInvoices, getInvoices } from "@/pages/invoice/store/actions";
import Dropdown from "@/components/ui/Dropdown";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

const InvoiceList = ({ title = "Manage Invoices" }) => {
  const navigate = useNavigate();
  const [modalName, setModalName] = useState("");
  const [userPermission, setUserPrmission] = useState(
    JSON.parse(
      sessionStorage.getItem("permission") &&
        CryptoJS.AES.decrypt(
          sessionStorage.getItem("permission"),
          "secretKey"
        ).toString(CryptoJS.enc.Utf8)
    )
  );
  const actions = [
    {
      name: "edit",
      permission: "invoice-edit",
      icon: "heroicons:pencil-square",
      doit: (row) => {
        if (row?.cell?.row?.values?.status == "success") {
          toast.error("Invoice Payment Done, you can't edit now");
        } else {
          navigate("/invoice-edit/" + row?.cell?.value);
        }
      },
    },
    {
      name: "P-Link",
      permission: "payment-page",
      icon: "ph:paper-plane-right",
      doit: (row) => {
        // window.addEventListener('storage', () => {
        //     // console.log('another window or tab is working on the same localStorage')
        //     console.log(localStorage.getItem('api_counter'))
        //     //window.close();
        // }, false)
        //console.log(row?.cell?.row?.original?.link_ref);
        window.open(
          window.location.origin + "/payment/" + row?.cell?.value,
          "_blank"
        );
      },
    },
    {
      name: "view",
      permission: "invoice-preview",
      icon: "heroicons-outline:eye",
      doit: (row) => {
        //console.log(row?.cell?.row?.values?.status);
        navigate("/invoice-preview/" + row?.cell?.value);
      },
    },
    {
      name: "delete",
      permission: "invoice-delete",
      icon: "heroicons-outline:trash",
      doit: (row) => {
        if (row?.cell?.row?.values?.status == "success") {
          toast.error("Invoice Payment Done, you can't delete now");
        } else {
          deleteConfirm(row);
        }
      },
    },
  ];
  const COLUMNS = [
    {
      Header: "Order",
      accessor: "invoice_ref",
      Cell: (row) => {
        //return <span onClick={() => console.log(row?.cell?.row?.original)}>#{row?.cell?.value}</span>;
        return (
          <span
            className="text-blue-600"
            onClick={() =>
              navigate("/invoice-preview/" + row?.cell?.row?.original?.uuid)
            }
          >
            #{row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "customer",
      accessor: "name",
      Cell: (row) => {
        return (
          <div
            onClick={() =>
              navigate("/invoice-preview/" + row?.cell?.row?.original?.uuid)
            }
          >
            <span className="inline-flex items-center">
              <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                {row?.cell?.value}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "date",
      accessor: "issued_date",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Currency",
      accessor: "currency",
      Cell: (row) => {
        return (
          <span
            onClick={() =>
              navigate("/invoice-preview/" + row?.cell?.row?.original?.uuid)
            }
          >
            {row?.cell?.value?.coin?.asset_name}
          </span>
        );
      },
    },
    {
      Header: "Invoice Type",
      accessor: "invoice_type",
      Cell: (row) => {
        return (
          <div
            onClick={() =>
              navigate("/invoice-preview/" + row?.cell?.row?.original?.uuid)
            }
          >
            <span className="inline-flex items-center">
              <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                {row?.cell?.value == "S" ? "Sale" : "Recursion"}
              </span>
            </span>
          </div>
        );
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "amount",
      accessor: "grand_total",
      Cell: (row) => {
        return (
          <span
            onClick={() =>
              navigate("/invoice-preview/" + row?.cell?.row?.original?.uuid)
            }
          >
            USD {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "status",
      accessor: "payment_status",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === "success"
                  ? "text-success-500 bg-success-500"
                  : ""
              } 
                  ${
                    row?.cell?.value === "pending"
                      ? "text-warning-500 bg-warning-500"
                      : ""
                  }
                  ${
                    row?.cell?.value === "cancled" ||
                    row?.cell?.value === "declined"
                      ? "text-danger-500 bg-danger-500"
                      : ""
                  }
                  ${
                    row?.cell?.value === "refund"
                      ? "text-primary-500 bg-primary-500"
                      : ""
                  }
                  
                   `}
            >
              {row?.cell?.value}
            </span>
          </span>
        );
      },
    },
    {
      Header: "action",
      accessor: "uuid",
      Cell: (row) => {
        return (
          <div className="relative z-[99] overflow-visible">
            <Dropdown
              classMenuItems="right-0  w-[140px] top-[110%] "
              label={
                <span className="text-xl text-center block w-full">
                  <Icon icon="heroicons-outline:dots-vertical" />
                </span>
              }
              // positionClass="absolute"
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800 ">
                {actions.map(
                  (item, i) =>
                    userPermission.includes(item.permission) && (
                      <div
                        key={i}
                        onClick={() => item.doit(row)}
                        className={`
                      
                        ${
                          item.name === "delete"
                            ? "bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white"
                            : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                        }
                         w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
                         first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse `}
                      >
                        <span className="text-base">
                          <Icon icon={item.icon} />
                        </span>
                        <span>{item.name}</span>
                      </div>
                    )
                )}
              </div>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const { isLoading } = useSelector((state) => state.loader);
  const { invoices } = useSelector((state) => state.invoices);
  const { itemsPerPage } = useSelector((state) => state.invoices);
  const { currentPage } = useSelector((state) => state.invoices);
  const { globalSearch } = useSelector((state) => state.invoices);
  const { deleteConfrim } = useSelector((state) => state.confirmation);
  const { deleteAll } = useSelector((state) => state.confirmation);
  const [deleteRow, setDeleteRow] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchInvoices(handleParams());
  }, [itemsPerPage]);

  const handleParams = (page = currentPage, clearSearch = false) => {
    let params = [];
    params.page = page;
    params.itemsPerPage = itemsPerPage;
    params.sortDesc = "desc";
    params.type = "internal";
    params.invoice_type = "S";
    params.query = clearSearch ? "" : globalSearch;
    let query = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      })
      .join("&");

    return query;
  };

  const fetchInvoices = async (query) => {
    dispatch(removeInvoicesError());
    dispatch(ON_LOADING(true));

    await getInvoices(query).then((invoices) => {
      dispatch(ON_LOADING(false));
      invoices && dispatch(setInvoices(invoices));
    });
  };

  const searchRequest = async (state) => {
    dispatch(setCurrentPage(1));
    const query = handleParams(1, state);
    dispatch(removeInvoicesError());
    dispatch(ON_LOADING(true));
    await getInvoices(query).then((invoices) => {
      dispatch(ON_LOADING(false));
      invoices && dispatch(setInvoices(invoices));
    });
  };

  const handlePaginationChange = (page) => {
    fetchInvoices(handleParams(page));
  };

  const deleteConfirmAll = (value) => {
    const text = '{"cell":{"row":{"values":{"name":"Delete All"}}}}';
    const obj = JSON.parse(text);
    //console.log('obj', obj);
    if (value == "deleted") {
      setDeleteRow(obj);
      dispatch(setDeleteAll(true));
      dispatch(setactiveModal(true));
    }
  };

  const deleteConfirm = async (row) => {
    setDeleteRow(row);
    dispatch(setactiveModal(true));
  };

  const deleteRecord = async () => {
    if (deleteAll == true) {
      dispatch(removeInvoicesError());
      await deleteInvoices(selectedInvoices).then((data) => {
        if (data.resp) {
          dispatch(setactiveModal(false));
          dispatch(setdeleteConfrim(false));
          fetchInvoices(handleParams());
        } else {
          alert(data.error);
        }
      });
    } else {
      dispatch(removeInvoicesError());
      await deleteInvoices(deleteRow?.cell?.value).then((data) => {
        if (data.resp) {
          dispatch(setactiveModal(false));
          dispatch(setdeleteConfrim(false));
          fetchInvoices(handleParams());
        } else {
          alert(data.error);
        }
      });
    }
  };

  const columns = useMemo(() => COLUMNS, []);

  return (
    <>
      <Confirmation
        title="Confirm"
        label="Confirm"
        labelClass="btn-outline-dark"
        className="max-w-md"
        centered
        footerContent={
          <Button
            text={"Delete"}
            isLoading={deleteConfrim}
            className="btn-danger "
            onClick={() => {
              dispatch(setdeleteConfrim(true));
              deleteRecord();
            }}
          />
        }
      >
        <h4 className="font-medium text-[16px] text-center text-slate-900">
          ({deleteRow?.cell?.row?.values?.name})
        </h4>
        <h4 className="font-medium text-[12px] text-center text-slate-900">
          Are you sure you want delete..?
        </h4>
      </Confirmation>

      {isLoading && <Loader />}
      <Card>
        {invoices?.data && (
          <InvoiceTable
            title={title}
            columns={columns}
            invoiceData={invoices}
            handlePaginationChange={handlePaginationChange}
            setModalName={setModalName}
            setSelectedInvoices={setSelectedInvoices}
            deleteConfirmAll={deleteConfirmAll}
            searchRequest={searchRequest}
          />
        )}
      </Card>
    </>
  );
};

export default InvoiceList;
