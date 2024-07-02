import React, { useState } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { useLocation } from "react-router-dom";
import Modal from "../Modal";
import { Icon } from "@iconify/react";
import Button from "../Button";
import {
  getTransactionDetails,
  sendTransactionLink,
} from "../../../pages/invoice/store/actions";
import { useDispatch } from "react-redux";
import { ON_LOADING } from "@/store/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";

const columns = [
  {
    label: ["Invoice Ref", "Tran. Number"],
    field: "invoice_ref",
  },

  {
    label: [" Payment Url"],
    field: "payment_url",
  },
  {
    label: ["Payment Status"],
    field: "payment_status",
  },
  {
    label: ["Crypto Amount", "Invoice Price"],
    field: "crypto_amount",
  },
  {
    label: ["Payment Date"],
    field: "payment_date",
  },
  {
    label: ["Created at", "Last update at"],
    field: "created_at",
  },
  {
    label: ["Paid Date"],
    field: "crypto_payment_date",
  },
  {
    label: ["Action"],
    field: "action",
  },
];

const TranscationTable = ({ getAllTranscation }) => {
  const { isLoading } = useSelector((state) => state.loader);

  const baseUrl = window.location.origin;
  const dispatch = useDispatch();
  const [allDetails, setAllDetails] = useState(false);
  const [transactionRef, setTransactionRef] = useState();
  const location = useLocation();
  let d1, d2, current;
  current = new Date();
  const fetchTransactionDetails = async (uuid) => {
    setAllDetails(true);
    dispatch(ON_LOADING(true));
    await getTransactionDetails(uuid).then((data) => {
      dispatch(ON_LOADING(false));
      data && setTransactionRef(data);
    });
  };
  const sendTransactionMail = async (uuid) => {
    setAllDetails(true);
    dispatch(ON_LOADING(true));
    await sendTransactionLink(uuid).then((data) => {
      dispatch(ON_LOADING(false));
      toast.success("Payment Link successfully Sent!");
    });
  };
  return (
    <>
      <div className="grid xl:grid-cols-1 gap-5">
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-y-auto ">
              <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                <thead className=" border-t border-slate-100 dark:border-slate-800">
                  <tr>
                    {columns.map((column, i) => (
                      <th key={i} scope="col" className=" table-th ">
                        {column.label.map((data, id) => (
                          <div key={id} className="whitespace-nowrap">
                            {data}
                          </div>
                        ))}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                  {getAllTranscation.map((row, i) => (
                    <tr key={i}>
                      <td
                        className="table-td uppercase cursor-pointer text-blue-600"
                        onClick={() => {
                          fetchTransactionDetails(row?.uuid);
                        }}
                      >
                        {row?.invoice?.invoice_ref} <br /> {row.trxnumber}
                      </td>

                      <td className="table-td">
                        {" "}
                        <a
                          className={`text-primary-500 bg-primary-500 table-td inline-block mx-auto py-1 px-3 min-w-[90px] text-center  rounded-full bg-opacity-25`}
                          href={
                            baseUrl +
                            "/payment/" +
                            row?.invoice_id +
                            `/${row?.uuid}`
                          }
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Payment Link
                        </a>{" "}
                      </td>
                      {/* ( d1 = new Date(row?.currency_converion_expire_time), d2 =
                    new Date(row?.payment_verification_timer), d3 = new
                    Date(row?.expiration_estimate_date) ) */}
                      <td className="table-td">
                        <div
                          className={`${
                            new Date(row?.expiration_estimate_date) < current &&
                            row?.payment_verification === "pending"
                              ? "text-danger-500 bg-danger-500"
                              : row?.payment_verification === "inprocess"
                              ? "text-primary-500 bg-primary-500"
                              : "text-info-500 bg-info-500"
                          } table-td inline-block mx-auto py-1 px-3 min-w-[90px] text-center  rounded-full bg-opacity-25`}
                        >
                          {new Date(row?.expiration_estimate_date) < current &&
                          row?.payment_verification === "pending"
                            ? "expire"
                            : row?.payment_verification === "inprocess"
                            ? "inprocess"
                            : row?.payment_status}
                        </div>
                      </td>
                      <td className="table-td lowercase">
                        {row.crypto_amount}
                        <br />
                        {row.fiat_amount}
                      </td>
                      <td className="table-td lowercase">{row.payment_date}</td>
                      <td className="table-td lowercase">
                        {row.created_at.split("T")[0]} <br />
                        {row.updated_at.split("T")[0]}{" "}
                      </td>
                      <td className="table-td">
                        <div
                          className={`${
                            new Date(row?.expiration_estimate_date) < current &&
                            row?.payment_verification === "pending"
                              ? "text-danger-500 bg-danger-500"
                              : row.payment_status == "success"
                              ? row.crypto_payment_date
                              : "text-secondary-500 bg-secondary-500"
                          } table-td inline-block mx-auto py-1 px-3 min-w-[90px] text-center  rounded-full bg-opacity-25`}
                        >
                          {new Date(row?.expiration_estimate_date) < current &&
                          row?.payment_verification === "pending"
                            ? "expire"
                            : row.payment_status == "success"
                            ? row.crypto_payment_date
                            : "Waiting"}
                        </div>
                      </td>
                      <td className="table-td lowercase">
                        <Tooltip
                          content="Detail"
                          placement="top"
                          arrow
                          animation="shift-away"
                        >
                          <button
                            className="action-btn"
                            type="button"
                            onClick={() => {
                              fetchTransactionDetails(row?.uuid);
                            }}
                          >
                            <Icon icon="material-symbols:description-outline-rounded" />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title=""
        showModal={allDetails}
        setShowModal={setAllDetails}
        uncontrol
        spacing="pb-5"
        themeClass="bg-white text-slate-900"
        className="max-w-[700px] m-0 p-0"
        footerContent={
          <>
            {transactionRef?.payment_status !== "success" && (
              <Button
                text="Email pending transaction Link"
                className="btn-sm btn-danger"
                onClick={() => sendTransactionMail(transactionRef?.uuid)}
              />
            )}
            <Button
              text="Ok"
              className="btn-dark btn-sm"
              onClick={() => setAllDetails(false)}
            />
          </>
        }
      >
        {isLoading && <Loader position="absolute" />}
        <div className="grid capitalize grid-cols-5 gap-4 justify-center items-center px-2.5">
          {/* <div className=" col-span-2 justify-self-end md:text-base text-sm text-right text-right space-y-2"> */}
          <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
            Unique Identifier:
          </p>
          <p className="col-span-3 md:text-base text-sm">
            {transactionRef?.unique_identifier}
          </p>
          <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
            Invoice #:
          </p>
          <p className="col-span-3 md:text-base text-sm">
            {transactionRef?.invoice?.invoice_ref}
          </p>
          <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
            Transaction #:
          </p>
          <p className="col-span-3 md:text-base text-sm">
            {transactionRef?.trxnumber}
          </p>
          <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
            Payment Status:
          </p>
          <p
            className={`${
              transactionRef?.payment_status === "pending"
                ? "text-info-500 bg-info-500"
                : transactionRef?.payment_status === "inprocess"
                ? "text-warning-500 bg-warning-500"
                : transactionRef?.payment_status === "success"
                ? "text-success-500 bg-success-500"
                : "text-red-500 bg-red-500"
            } table-td col-span-3 md:text-base text-sm inline-block max-w-max py-1 px-3 min-w-[90px] text-center  rounded-full bg-opacity-25`}
          >
            {transactionRef?.payment_status}
          </p>
          <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
            Payment Verification:
          </p>
          <p
            className={`${
              transactionRef?.payment_verification === "pending"
                ? "text-info-500 bg-info-500"
                : transactionRef?.payment_verification === "inprocess"
                ? "text-warning-500 bg-warning-500"
                : transactionRef?.payment_verification === "successful"
                ? "text-success-500 bg-success-500"
                : "text-red-500 bg-red-500"
            } table-td col-span-3 md:text-base text-sm inline-block max-w-max py-1 px-3 min-w-[90px] text-center  rounded-full bg-opacity-25`}
          >
            {transactionRef?.payment_verification}
          </p>
          <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
            Fiat Amount (Invoice Grand Total):
          </p>
          <p className="col-span-3 md:text-base text-sm">
            {transactionRef?.fiat_amount} USD
          </p>
          <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
            Crypto Amount:
          </p>
          <p className="col-span-3 md:text-base text-sm">
            {transactionRef?.crypto_amount}{" "}
            {transactionRef?.currency?.coin?.symbols}
            <span>
              ({transactionRef?.currency?.coin?.network_type} -{" "}
              <span className=" uppercase">
                {transactionRef?.currency?.coin?.exchange}
              </span>)
            </span>{" "}
          </p>
          {transactionRef?.transection_hash && (
            <>
              <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
                Transaction Hash:
              </p>
              <p
                onClick={() =>
                  navigator.clipboard.writeText(
                    transactionRef?.transection_hash
                  )
                }
                className="col-span-3 md:text-base text-sm border p-1 rounded cursor-pointer max-w-96 max-h-20 bg-black-200 overflow-y-auto break-words"
              >
                {transactionRef?.transection_hash}
              </p>
            </>
          )}
          {transactionRef?.blockchain_link_with_transection_hash && (
            <>
              <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
                Blockchain Link:
              </p>
              <p
                onClick={() =>
                  navigator.clipboard.writeText(
                    transactionRef?.blockchain_link_with_transection_hash
                  )
                }
                className="col-span-3 md:text-base text-sm border lowercase p-1 rounded cursor-pointer max-w-96 max-h-20 bg-black-200 overflow-y-auto break-words"
              >
                {transactionRef?.blockchain_link_with_transection_hash}
              </p>
            </>
          )}
          {transactionRef?.success_return_url && (
            <>
              <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
                Success Return Url:
              </p>
              <p className="col-span-3 md:text-base text-sm">
                <a href={transactionRef?.invoice?.success_return_url}>
                  {transactionRef?.success_return_url}
                </a>
              </p>
            </>
          )}
          {transactionRef?.failed_return_url && (
            <>
              <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
                Fail Return Url:
              </p>
              <p className="col-span-3 md:text-base text-sm">
                <a href={transactionRef?.invoice?.failed_return_url}>
                  {transactionRef?.failed_return_url}
                </a>
              </p>
            </>
          )}

          <p className="col-span-2 justify-self-end md:text-base text-sm text-right">
            Payment Url:
          </p>
          <p className="col-span-3 md:text-base text-sm lowercase text-blue-600">
            <a
              href={
                baseUrl +
                "/payment/" +
                transactionRef?.invoice_id +
                `/${transactionRef?.uuid}`
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              {transactionRef?.uuid}
            </a>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default TranscationTable;
