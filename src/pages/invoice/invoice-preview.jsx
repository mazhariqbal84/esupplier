import React, { useState, useMemo, useEffect, Fragment } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import TranscationTable from "@/components/ui/invoices/TranscationTable";
import TotalTable from "./preview/TotalTable";
import userDarkMode from "@/hooks/useDarkMode";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import Loader from "@/components/Loader";
import { ON_LOADING } from "@/store/loader";
import { Tab, Disclosure, Transition } from "@headlessui/react";
// import images
import MainLogo from "@/assets/images/logo/logo.svg";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import {
  getInvoiceDetail,
  sendinvoicepdfonemail,
  invoicedownloadrequest,
  getTransctionList,
} from "@/pages/invoice/store/actions";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import TotalOrdersTable from "../orders/preview/TotalTable";
import SubscriptionDates from "../../components/ui/invoices/SubscriptionDates";
import { getSubscriptionDate, subscriptionDateClose } from "./store/actions";
import Modal from "../../components/ui/Modal";

const InvoicePreviewPage = () => {
  const location = useLocation();
  const { isLoading } = useSelector((state) => state.loader);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [getAllTranscation, setGetAllTranscation] = useState([]);
  const [allSubscriptionDates, setAllSubscriptionDates] = useState([]);
  const [subscriptionDate, setsubscriptionDate] = useState(false);
  const [baseUrl, setBaseUrl] = useState(null);
  const [userPermission, setUserPrmission] = useState(
    JSON.parse(
      sessionStorage.getItem("permission") &&
        CryptoJS.AES.decrypt(
          sessionStorage.getItem("permission"),
          "secretKey"
        ).toString(CryptoJS.enc.Utf8)
    )
  );
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const printPage = () => {
    window.print();
  };
  const [isDark] = userDarkMode();
  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchInvoices(params.id);
  }, []);
  const getSubscription = async (params) => {
    setsubscriptionDate(true);
  };
  const fetchInvoices = async (uuid) => {
    dispatch(ON_LOADING(true));
    await getInvoiceDetail(uuid).then((data) => {
      dispatch(ON_LOADING(false));
      data && setInvoiceDetails(data);
    });
  };
  const invoicesendonemail = async () => {
    dispatch(ON_LOADING(true));
    await sendinvoicepdfonemail(params.id).then((data) => {
      if (data === "success") {
        dispatch(ON_LOADING(false));
        toast.success("Email sent Successfuly", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        dispatch(ON_LOADING(false));
        toast.error(data);
      }
    });
  };
  const invoicedownload = async () => {
    dispatch(ON_LOADING(true));
    await invoicedownloadrequest(params.id).then((data) => {
      dispatch(ON_LOADING(false));
      const link = document.createElement("a");
      link.download = "Example-PDF-File";
      link.href = data;
      link.target = "_blank";
      link.click();
    });
  };
  const subscriptionClosed = async () => {
    dispatch(ON_LOADING(true));
    await subscriptionDateClose(params.id).then((data) => {
      dispatch(ON_LOADING(false));
      data && toast.success("Subscription closed successfully!");
    });
  };
  const loadTranscation = async (tab) => {
    if (tab === "Transcation") {
      dispatch(ON_LOADING(true));
      await getTransctionList(params.id).then((data) => {
        dispatch(ON_LOADING(false));
        setGetAllTranscation(data?.data);
      });
    }
  };

  const buttons = [
    {
      title: "Invoice",
      icon: "heroicons-outline:home",
    },
    {
      title: "Transcation",
      icon: "heroicons-outline:user",
    },
    {
      title: "Subscription Payment dates",
      icon: "heroicons-outline:user",
    },
  ];

  return (
    <div>
      {isLoading && <Loader />}
      <Card
        title={invoiceDetails?.name}
        titleClass="text-center"
        headerClass="!block"
      >
        <Tab.Group>
          <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
            {buttons.map((item, i) => (
              <Tab
                as={Fragment}
                key={i}
                onClick={() => loadTranscation(item.title)}
              >
                {({ selected }) => (
                  <button
                    className={` md:text-sm text-xs font-medium md:mb-7 mb-5 capitalize bg-white 
             dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none md:px-2 px-1
              transition duration-150 before:transition-all before:duration-150 relative 
              before:absolute before:left-1/2 before:bottom-[-6px] before:h-[1.5px] before:bg-primary-500 
              before:-translate-x-1/2 
              
              ${
                selected
                  ? "text-primary-500 before:w-full"
                  : "text-slate-500 before:w-0 dark:text-slate-300"
              }
              `}
                  >
                    {invoiceDetails?.invoice_type === "S" && i == 2
                      ? ""
                      : item.title}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="flex justify-between gap-2.5 flex-wrap items-center mb-6">
                <h4 className="uppercase italic  underline decoration-dotted">
                  {" "}
                  {invoiceDetails?.name}
                </h4>
                <div className="flex ml-auto items-center flex-wrap space-xy-5">
                  {invoiceDetails?.invoice_source !== "external" &&
                    userPermission.includes("invoice-edit") &&
                    invoiceDetails?.status != "success" && (
                      <button
                        onClick={() =>
                          navigate("/invoice-edit/" + invoiceDetails?.uuid)
                        }
                        className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-slate-800 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-white rtl:space-x-reverse"
                      >
                        <span className="text-lg">
                          <Icon icon="heroicons:pencil-square" />
                        </span>
                        <span>Edit</span>
                      </button>
                    )}
                  <button
                    onClick={() => invoicedownload()}
                    className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-slate-800 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-white rtl:space-x-reverse"
                  >
                    <span className="text-lg">
                      <Icon icon="heroicons:arrow-down-tray" />
                    </span>
                    <span>Download/Print</span>
                  </button>
                  {invoiceDetails?.invoice_type === "R" && (
                    <button
                      onClick={() => subscriptionClosed()}
                      className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-slate-800 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-white rtl:space-x-reverse"
                    >
                      <span className="text-lg">
                        <Icon icon="fluent:lock-closed-20-regular" />
                      </span>
                      <span>Subscription Close</span>
                    </button>
                  )}
                  <button
                    onClick={() => invoicesendonemail()}
                    className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-slate-800 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-white rtl:space-x-reverse"
                  >
                    <span className="text-lg transform -rotate-45">
                      <Icon icon="heroicons:paper-airplane" />
                    </span>
                    <span>Send invoice</span>
                  </button>
                </div>
              </div>
              <Card bodyClass="p-0">
                <div
                  className="flex justify-between flex-wrap space-y-4 md:px-6 
 px-4 pt-6 bg-slate-50 dark:bg-slate-800 pb-6 rounded-t-md"
                >
                  <div>
                    {/* <img src={isDark ? LogoWhite : MainLogo} alt="" /> */}
                    <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl">
                      Bill From:
                    </span>
                    <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm max-w-50">
                      {invoiceDetails?.user?.company_detail?.company_name}
                      <br />
                      {invoiceDetails?.user?.company_detail?.company_address}
                      <div className="flex space-x-2 mt-2 leading-[1] rtl:space-x-reverse">
                        <Icon icon="heroicons-outline:phone" />
                        <span>
                          {invoiceDetails?.user?.company_detail?.company_phone}
                        </span>
                      </div>
                      <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                        <Icon icon="heroicons-outline:mail" />
                        <span>
                          {invoiceDetails?.user?.company_detail?.company_email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl">
                      Bill to:
                    </span>

                    <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm">
                      {invoiceDetails?.name} <br />
                      {invoiceDetails?.address} <br />
                      <div className="flex space-x-2 mt-2 leading-[1] rtl:space-x-reverse">
                        <Icon icon="heroicons-outline:phone" />
                        <span>{invoiceDetails?.phone}</span>
                      </div>
                      <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                        <Icon icon="heroicons-outline:mail" />
                        <span>{invoiceDetails?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-[2px]">
                    {invoiceDetails?.invoice_source !== "external" ? (
                      <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl mb-4">
                        Invoice:
                      </span>
                    ) : (
                      <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl mb-4">
                        Order:
                      </span>
                    )}
                    {invoiceDetails?.invoice_source !== "external" ? (
                      <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
                        Invoice number:
                      </h4>
                    ) : (
                      <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
                        Order number:
                      </h4>
                    )}
                    <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
                      {invoiceDetails?.invoice_ref}
                    </div>
                    <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
                      date
                    </h4>
                    <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
                      {invoiceDetails?.issued_date}
                    </div>
                  </div>
                  <div className="space-y-[2px]">
                    <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 mb-4">
                      <div className="text-slate-600 font-medium mt-5 dark:text-slate-300 uppercase">
                        {invoiceDetails?.payment_status === "success" ? (
                          <h1 className="block md:text-[60px] text-[40px] font-bold underline decoration-dotted text-green-500">
                            Paid
                          </h1>
                        ) : invoiceDetails?.payment_status === "pending" ? (
                          <h1 className="block md:text-[60px] text-[40px] font-bold underline decoration-dotted text-red-500">
                            Unpaid
                          </h1>
                        ) : (
                          invoiceDetails?.payment_status === "refund" && (
                            <h1 className="block md:text-[60px] text-[40px] font-bold underline decoration-dotted text-primary-500">
                              Refund
                            </h1>
                          )
                        )}
                      </div>
                    </span>
                  </div>
                </div>
                {invoiceDetails?.invoice_source !== "external" ? (
                  <div className="max-w-[980px] mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                    <TotalTable invoiceDetails={invoiceDetails} />
                  </div>
                ) : (
                  <div className="max-w-[980px] mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                    <TotalOrdersTable invoiceDetails={invoiceDetails} />
                  </div>
                )}
                {userPermission.includes("payment-page") &&
                  invoiceDetails?.invoice_source !== "external" && (
                    <div className="md:py-10 py-5 text-center text-slate-600 dark:text-slate-300">
                      <button
                        onClick={() => {
                          invoiceDetails?.invoice_type == "S"
                            ? window.open(
                                window.location.origin +
                                  "/payment/" +
                                  invoiceDetails?.uuid,
                                "_blank"
                              )
                            : getSubscription(invoiceDetails?.uuid);
                        }}
                        className="invocie-btn inline-flex btn  whitespace-nowrap space-x-1 cursor-pointer bg-slate-800 dark:bg-slate-800 dark:text-slate-300  h-min  font-normal text-white rtl:space-x-reverse"
                      >
                        Payment Link
                      </button>
                    </div>
                  )}
                {invoiceDetails?.invoice_source !== "external" ? (
                  <div className="md:py-10 py-5 text-center md:text-2xl text-xl font-normal text-slate-600 dark:text-slate-300">
                    Thank you for your purchase!
                  </div>
                ) : (
                  <div className="md:py-10 py-5 text-center md:text-2xl text-xl font-normal text-slate-600 dark:text-slate-300">
                    Thank you for your interest!
                  </div>
                )}
              </Card>
            </Tab.Panel>
            <Tab.Panel>
              <TranscationTable getAllTranscation={getAllTranscation} />
            </Tab.Panel>
            {invoiceDetails?.invoice_type === "R" && (
              <Tab.Panel>
                <SubscriptionDates
                  uuid={invoiceDetails?.uuid}
                  allSubscriptionDates={allSubscriptionDates}
                  setAllSubscriptionDates={setAllSubscriptionDates}
                />
              </Tab.Panel>
            )}
          </Tab.Panels>
        </Tab.Group>
      </Card>
      <Modal
        title=""
        showModal={subscriptionDate}
        setShowModal={setsubscriptionDate}
        uncontrol
        spacing=" px-5"
        themeClass="bg-white text-slate-900"
        className="max-w-[900px] max-h-[720px] overflow-y-auto"
      >
        <SubscriptionDates
          uuid={invoiceDetails?.uuid}
          allSubscriptionDates={allSubscriptionDates}
          setAllSubscriptionDates={setAllSubscriptionDates}
        />
      </Modal>
    </div>
  );
};

export default InvoicePreviewPage;
