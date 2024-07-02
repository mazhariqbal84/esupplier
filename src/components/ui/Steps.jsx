import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// import { updateProgressSteps } from "../../pages/payment/store/store";
import { useEffect } from "react";

const Steps = ({
  checkSteps,
  isPending,
  isConfirmed,
  isConfirming,
  isIdle,
  solanaPaymentStatus,
}) => {
  const dispatch = useDispatch();
  const [progressSteps, updateProgressSteps] = useState(null);
  const { paymentDetails } = useSelector((state) => state.payment);
  const steps = [
    {
      id: 1,
      text: "Waiting for payment",
    },
    {
      id: 2,
      text: "Confirming on blockchain",
    },
    {
      id: 3,
      text: "Confirmed on Blockchain",
    },
  ];
  useEffect(() => {
    // console.log("statyus", paymentDetails?.status);
    let status;
    if (
      paymentDetails?.payment_verification === "successful" ||
      isConfirmed ||
      solanaPaymentStatus === 2
    ) {
      status = 3;
    } else if (
      (paymentDetails?.payment_verification === "inprocess" &&
        paymentDetails?.payment_verification_timer) ||
      isConfirming ||
      solanaPaymentStatus === 1
    ) {
      status = 1;
    } else if (
      paymentDetails?.payment_verification === "pending" ||
      isIdle ||
      isPending ||
      solanaPaymentStatus === 0
    ) {
      status = 0;
    } else {
      status = -1;
    }
    updateProgressSteps(status);
  }, [paymentDetails]);

  return (
    <div>
      <div className="mx-auto mb-10 flex z-[5] items-center relative justify-center">
        {steps.map((item, i) => (
          <div
            className="relative z-[1] items-center item flex flex-start flex-1 last:flex-none"
            key={i}
          >
            <div
              className={`   ${
                progressSteps >= i ? "" : ""
              }    rounded-full flex flex-col items-center justify-center relative z-[66] text-lg font-medium`}
            >
              {progressSteps <= i ? (
                progressSteps === i ? (
                  <div className="relative bg-white  text-center flex flex-col justify-center items-center ">
                    <div className="h-5 w-5 z-10 animate-spin border-t-slate-800 border-l-slate-800 border-[2px] rounded-full border-green-100 bg-white"></div>
                    <p className="text-sm absolute font-normal top-10 w-32">
                      {item.text}
                    </p>
                  </div>
                ) : (
                  <div className="relative bg-white  text-center flex flex-col justify-center items-center ">
                    <div className="h-5 w-5 z-10  border-[2px] rounded-full border-black-100 bg-white"></div>
                    <p className="text-sm absolute font-normal text-gray-400 top-10 w-32">
                      {item.text}
                    </p>
                  </div>
                )
              ) : (
                <div className="relative bg-white  text-center flex flex-col justify-center items-center ">
                  <Icon
                    icon="bx:check-double"
                    className="text-green-600 rounded-full h-6 w-6 p-px border-2 border-green-600 text-lg"
                  />
                  <p className="text-sm  absolute top-10 w-32">{item.text}</p>
                </div>
              )}
            </div>

            <div
              className={`${
                progressSteps > i ? "bg-green-500" : "bg-green-100"
              } absolute top-2.5 h-[2px] w-full`}
            ></div>

            <div className="text-sm mt-[10px] leading-[16px] font-medium capitalize text-slate-500 text-center"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Steps;
