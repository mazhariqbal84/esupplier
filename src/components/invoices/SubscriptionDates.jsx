import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Tooltip from "@/components/ui/Tooltip";
import { useLocation, useParams } from "react-router-dom";
import Modal from "../Modal";
import { Icon } from "@iconify/react";
import Button from "../Button";
import {
  getSubscriptionDate,
  getTransactionDetails,
  sendTransactionLink,
} from "../../../pages/invoice/store/actions";
import { useDispatch } from "react-redux";
import { ON_LOADING } from "@/store/loader";
import { toast } from "react-toastify";
const columns = [
  {
    label: ["ID"],
    field: "id",
  },
  {
    label: ["CUSTOMER Name"],
    field: "name",
  },
  {
    label: ["Grand Total"],
    field: "total",
  },
  {
    label: ["Payment Date"],
    field: "subscription_date",
  },
  {
    label: ["Status"],
    field: "status",
  },
  {
    label: ["Payment Link"],
    field: "Payment_link",
  },
];

const SubscriptionDates = ({
  uuid,
  allSubscriptionDates,
  setAllSubscriptionDates,
}) => {
  const params = useParams();
  // console.log(allSubscriptionDates);
  const baseUrl = window.location.origin;
  const dispatch = useDispatch();
  const location = useLocation();
  let d1, d2, current;
  current = new Date();
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  useEffect(() => {
    getSubscription(currentPage);
    // Pass page number starting from 1 to your fetchData function
  }, [currentPage]);
  const getSubscription = async (currentPage) => {
    dispatch(ON_LOADING(true));
    await getSubscriptionDate(currentPage, uuid).then((data) => {
      dispatch(ON_LOADING(false));
      // console.log(data);
      setAllSubscriptionDates(data);
    });
  };

  return (
    <>
      <div className="grid xl:grid-cols-1 gap-5 pb-10">
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-y-auto ">
              <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                <thead className=" border-t border-slate-100 dark:border-slate-800">
                  <tr>
                    {columns.map((column, i) => (
                      <th key={i} scope="col" className=" table-th ">
                        {column.label.map((data, id) => (
                          <div key={id}>{data}</div>
                        ))}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                  {allSubscriptionDates?.data?.length > 0 ? (
                    allSubscriptionDates?.data?.map((row, i) => (
                      <tr
                        key={i}
                        className={`${
                          row?.invoice?.status === "closed"
                            ? "bg-slate-50"
                            : row?.status == 0
                            ? "cursor-pointer "
                            : "bg-slate-50 "
                        } `}
                        onClick={() =>
                          row?.invoice?.status === "closed"
                            ? ""
                            : row?.status == 0 &&
                              window.open(
                                baseUrl +
                                  `/payment/${row?.invoice_uuid}?suuid=${row?.uuid}`
                              )
                        }
                      >
                        <td className="table-td"> {i + 1}</td>
                        <td className="table-td"> {row?.invoice?.name}</td>
                        <td className="table-td">
                          {row?.invoice?.grand_total}
                        </td>
                        <td className="table-td lowercase">
                          {row.subscription_date}
                        </td>
                        <td className="table-td">
                          <div
                            className={`${
                              row?.status === 0
                                ? "text-danger-500 bg-danger-500"
                                : "text-success-500 bg-success-500"
                            } table-td inline-block w-max mx-auto py-1 px-3 min-w-[90px] text-center  rounded-full bg-opacity-25`}
                          >
                            {row.status == 0
                              ? "Pending"
                              : row?.status == 1 && "Done"}
                          </div>
                        </td>
                        <td className="table-td nowrap">
                          <div
                            className={`text-primary-500 w-max bg-primary-500 table-td inline-block mx-auto py-1 px-3 min-w-[90px] text-center  rounded-full bg-opacity-25`}
                          >
                            Payment link
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className=" text-center pb-5">
                      <td>No data available !</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageChange}
          pageRangeDisplayed={5}
          pageCount={allSubscriptionDates?.last_page}
          previousLabel="<"
          className="ReactPaginate"
          renderOnZeroPageCount={null}
        />
      </div>
    </>
  );
};

export default SubscriptionDates;
