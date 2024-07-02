import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Flatpickr from "react-flatpickr";
import * as yup from "yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ApiService from "../../store/services/api.service";
import { toast } from "react-toastify";
import Check from "@/assets/images/icon/check.svg";
import Copytexticon from "@/assets/images/icon/copytexticon.svg";
import Logo from "@/assets/images/logo/mainLogo.svg";
import Select from "../../components/ui/Select";
// import Select, { components } from "react-select";
import { useEffect } from "react";
import InvoiceItemTable from "../../components/ui/invoices/InvoiceItemTable";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ON_LOADING } from "@/store/loader";

import InputPhone from "@/components/ui/InputPhone";
import Modal from "../../components/ui/Modal";
import Loader from "@/components/Loader";
const InvoiceAddPage = () => {
  const VITE_SITE_URL = import.meta.env.VITE_SITE_URL;
  const dateArraySchema = yup.array().of(yup.date());
  const FormValidationSchema = yup
    .object({
      currency_id: yup.string().required("Currency is required"),
      name: yup.string().required("Name is required"),
      email: yup.string().required("Email is required"),
      // phone: yup.string().required("Phone is required"),
      phoneInputWithCountrySelect: yup
        .string()
        .min(8, "Phone # be at least 8 characters")
        .max(15, "Phone # shouldn't be more than 15 characters")
        .nullable(),
      // .required("Phone is required"),
      address: yup.string().nullable(),
      payment_cycle: yup.string().when("invoice_type", {
        is: (value) => value === "R",
        then: yup.string().required("Payment cycle is required"),
        otherwise: yup.string().nullable(),
      }),
      invoice_type: yup.string().required("Invoice type is required"),
      from_date: yup
        .array()
        .of(yup.date())
        .when("invoice_type", {
          is: (value) => value == "R",
          then: yup
            .array()
            .of(yup.date())
            .nullable()
            .required("From Date is required"),
          otherwise: yup.array().of(yup.date()).nullable().default([]),
        }),
      to_date: yup
        .array()
        .of(yup.date())
        .when("invoice_type", {
          is: (value) => value == "R",
          then: yup
            .array()
            .of(yup.date())
            .nullable()
            .required("To Date is required"),
          otherwise: yup.array().of(yup.date()).nullable().default([]),
        }),
    })
    .required();
  const date = new Date(); // Now
  const thirdydate = date.setDate(date.getDate() + 365);
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    getFieldState,
    watch,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
    defaultValues: {
      currency_id: "",
      name: "",
      email: "",
      // phone: "",
      phoneInputWithCountrySelect: null,
      address: "",
      inv_description: "",
      from_date: [new Date()],
      to_date: thirdydate && [new Date(thirdydate)],
      invoice_type: "",
      payment_cycle: "",
    },
  });

  const dispatch = useDispatch();

  // ///////////////////      States      ///////////////////
  const invoiceType = [
    { value: "S", label: "Sale" },
    { value: "R", label: "Recurring" },
  ];
  const [paymentcycle, setPaymentcycle] = useState();
  // let paymentcycle = [
  //   { value: "7", label: "Every 7 Days" },
  //   { value: "15", label: "Every 15 Days" },
  //   { value: "30", label: "Every 30 Days" },
  // ];
  const [paymentUrl, setPaymentUrl] = useState(false);
  const [copyPaymentUrl, setCopyPaymentUrl] = useState(false);
  const [return_url, setReturn_url] = useState([]);
  const [picker, setPicker] = useState(new Date());
  const [pickerFrom, setPickerFrom] = useState(new Date());
  const [pickerTo, setPickerTo] = useState(thirdydate);
  const [invoiceRef, setInvoiceRef] = useState();
  const [currencyList, setCurrencyList] = useState([]);
  const [invoiceItem, setInvoiceItem] = useState({
    description: "",
    price: "",
    qty: "",
    subtotal: 0,
    discount: 0,
    tax_applied: 0,
    total: 0,
  });
  const [InvoiceDetails, setInvoiceDetails] = useState(null);

  const [isEdit, setIsEdit] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [invoiceItemsList, setInvoiceItemsList] = useState([]);

  const [itemErrors, setItemErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editBlock, setEditBlock] = useState(false);
  const [invoiceTypeSelect, setInvoiceTypeSelect] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getCurrencyList();
    location.pathname.split("/")[1] == "invoice-edit" && getSingleInvoice();
  }, []);

  useEffect(() => {
    if (InvoiceDetails) {
      setInvoiceItemsList(InvoiceDetails?.details);
      setPicker(InvoiceDetails?.issued_date);
      setInvoiceRef(InvoiceDetails?.invoice_ref);
      setValue("currency_id", InvoiceDetails?.currency_id);
      setValue("name", InvoiceDetails?.name);
      setValue("email", InvoiceDetails?.email);
      setValue("phoneInputWithCountrySelect", InvoiceDetails?.phone);
      setValue("address", InvoiceDetails?.address);
      setValue("inv_description", InvoiceDetails?.inv_description);
      setValue("from_date", [new Date(InvoiceDetails?.from_date)]);
      setValue("to_date", [new Date(InvoiceDetails?.to_date)]);
      setValue("payment_cycle", InvoiceDetails?.recursion);
      setValue("invoice_type", InvoiceDetails?.invoice_type);
    }
  }, [InvoiceDetails]);

  // const handleChange = (e) => {
  //   console.log("e=======>" + e.target.value);
  //   setInvoiceTypeSelect(e.target.value);
  // };
  const getCurrencyList = () => {
    ApiService.setHeader();
    ApiService.get(`api/get-currencies-list-for-payment`).then((result) => {
      if (result?.data?._metadata?.outcome === "SUCCESS") {
        setCurrencyList(result?.data?.records);
      } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
        window.open("/package-expire", "_self");
      } else {
        toast.error(result?.data?.errors[0]);
      }
    });
  };

  const getSingleInvoice = () => {
    dispatch(ON_LOADING(true));
    ApiService.setHeader();
    ApiService.get(
      `api/internal-invoices/get-single-invoice/${
        location.pathname.split("/")[2]
      }`
    ).then((result) => {
      dispatch(ON_LOADING(false));
      if (result?.data?._metadata?.outcome === "SUCCESS") {
        setInvoiceDetails(result?.data?.records);
        if (result?.data?.records?.status === "success") {
          setEditBlock(true);
        }
      } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
        window.open("/package-expire", "_self");
      } else {
        toast.error(result?.data?.errors[0]);
      }
    });
  };

  const onSubmit = (data) => {
    // console.log("on submit data => ", data);
    // console.log("Data for invoice items", data);
    const {
      currency_id,
      name,
      issued_date,
      email,
      phoneInputWithCountrySelect,
      address,
      from_date,
      to_date,
      inv_description,
      invoice_type,
      invoice_items,
      payment_cycle,
    } = data;

    const payload = {
      currency_id,
      name,
      email,
      address,
      issued_date,
      inv_description,
      invoice_items,
      recursion: payment_cycle,
      invoice_type,
      from_date:
        from_date.length > 0
          ? from_date[0].getFullYear() +
            "-" +
            (from_date[0].getMonth() + 1) +
            "-" +
            from_date[0].getDate()
          : null,
      to_date:
        to_date.length > 0
          ? to_date[0].getFullYear() +
            "-" +
            (to_date[0].getMonth() + 1) +
            "-" +
            to_date[0].getDate()
          : null,
      phone: phoneInputWithCountrySelect,
      delivery_charges: 0,
    };
    const date = new Date(picker);
    payload.issued_date =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    if (location.pathname.split("/")[1] === "invoice-edit") {
      dispatch(ON_LOADING(true));

      ApiService.setHeader();
      ApiService.post(
        `api/internal-invoices/update-invoice/${
          location.pathname.split("/")[2]
        }`,
        payload
      ).then((result) => {
        if (result?.data?._metadata?.outcome === "SUCCESS") {
          dispatch(ON_LOADING(false));
          toast.success("Internal Invoice updated successfully.");
          setPaymentUrl(!paymentUrl);
          setReturn_url(result?.data?.records);
          // navigate("/invoices");
          // setInvoiceItemsList([])
          // resetItemFields()
          // reset()
        } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
          window.open("/package-expire", "_self");
        } else {
          dispatch(ON_LOADING(false));
          toast.error(result?.data?.errors[0]);
        }
      });
    } else {
      if (invoiceItemsList.length) {
        payload.invoice_items = invoiceItemsList;
        dispatch(ON_LOADING(true));

        ApiService.setHeader();
        // console.log("beforwe send data", payload);
        ApiService.post(`api/internal-invoices/create-invoice`, payload).then(
          (result) => {
            if (result?.data?._metadata?.outcome === "SUCCESS") {
              dispatch(ON_LOADING(false));
              toast.success("Internal Invoice created successfully.");
              setPaymentUrl(!paymentUrl);
              setReturn_url(result?.data?.records);
              setInvoiceItemsList([]);
              resetItemFields();
              reset();
            } else if (
              result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE"
            ) {
              window.open("/package-expire", "_self");
            } else {
              dispatch(ON_LOADING(false));
              toast.error(result?.data?.errors[0]);
            }
          }
        );
      } else {
        toast.error("Please add Invoice Item's");
        validateInvoiceItem();
      }
    }
  };

  const resetItemFields = () => {
    setIsEdit(false);
    setInvoiceItem({
      description: "",
      price: "",
      qty: "",
      subtotal: 0,
      discount: 0,
      tax_applied: 0,
      total: 0,
    });
  };

  const addItem = () => {
    if (validateInvoiceItem()) {
      if (location.pathname.split("/")[1] === "invoice-edit") {
        const uuid = location.pathname.split("/")[2];
        // console.log(uuid);
        // API DATA UPDATE
        setIsLoading(true);
        ApiService.setHeader();
        ApiService.post(
          `api/internal-invoices/create-invoice-item/${uuid}`,
          invoiceItem
        ).then((result) => {
          if (result?.data?._metadata?.outcome === "SUCCESS") {
            toast.success("Invoice item created successfully.");
            getSingleInvoice();
            resetItemFields();
          } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          } else {
            toast.error(result?.data?.errors[0]);
          }
        });
        setIsLoading(false);
      } else {
        // console.log("invoice item ", invoiceItem);
        //
        setInvoiceItemsList((prev) => [...prev, invoiceItem]);
      }
    }
  };

  const updateItem = () => {
    if (validateInvoiceItem()) {
      if (location.pathname.split("/")[1] === "invoice-edit") {
        // API DATA UPDATE
        setIsLoading(true);
        ApiService.setHeader();
        ApiService.post(
          `api/internal-invoices/update-invoice-item/${invoiceItem?.uuid}`,
          invoiceItem
        ).then((result) => {
          if (result?.data?._metadata?.outcome === "SUCCESS") {
            toast.success("Invoice item updated successfully.");
            getSingleInvoice();
            resetItemFields();
          } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          } else {
            toast.error(result?.data?.errors[0]);
          }
        });
        setIsLoading(false);
      } else {
        // LOCAL UPDATE
        setInvoiceItemsList(
          invoiceItemsList.map((item, index) => {
            return index === editItemIndex ? invoiceItem : item;
          })
        );
        setIsEdit(false);
        setInvoiceItem({
          description: "",
          price: "",
          qty: "",
          subtotal: 0,
          discount: 0,
          tax_applied: 0,
          total: 0,
        });
      }
    }
  };

  const validateInvoiceItem = () => {
    let isValid = true;
    const errors = {};

    if (!invoiceItem.description) {
      isValid = false;
      errors.description = "Description is required";
    }
    if (!invoiceItem.price) {
      isValid = false;
      errors.price = "Price is required";
    }
    if (!invoiceItem.qty) {
      isValid = false;
      errors.qty = "Qty is required";
    }
    if (!invoiceItem.subtotal) {
      isValid = false;
      errors.subtotal = "Subtotal is required";
    }
    if (invoiceItem.discount < 0) {
      isValid = false;
      errors.discount = "Discount is required";
    }
    if (!invoiceItem.tax_applied < 0) {
      isValid = false;
      errors.tax_applied = "Tax is required";
    }
    if (!invoiceItem.total) {
      isValid = false;
      errors.total = "Total is required";
    }
    // console.log(errors);
    setItemErrors(errors);
    return isValid;
  };

  const sendReturnUrlEmail = async (uuid) => {
    setIsLoading(true);
    ApiService.setHeader();
    await ApiService.get(`api/generate-invoice-pdf/${uuid}`).then((result) => {
      if (result?.data?._metadata?.outcome === "SUCCESS") {
        toast.success("Email sent Succesfully!");
      } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
        window.open("/package-expire", "_self");
      } else {
        toast.error(result?.data?.errors[0]);
      }
    });
    setIsLoading(false);
  };

  const handleItemInputs = (e) => {
    //console.log('target name ', e.target.name);
    setInvoiceItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (invoiceItem.price && invoiceItem.qty) {
      handleInvoiceItem();
    }
  }, [invoiceItem.price, invoiceItem.qty]);

  useEffect(() => {
    if (invoiceItem.tax_applied || invoiceItem.discount) {
      handleInvoiceItem();
    }
  }, [invoiceItem.tax_applied, invoiceItem.discount]);

  useEffect(() => {
    //console.log('invoiceItem changed = ', invoiceItem);
  }, [invoiceItem]);

  const handleInvoiceItem = () => {
    setInvoiceItem({
      ...invoiceItem,
      subtotal: invoiceItem.price * invoiceItem.qty,
      total: calculateItemTotalAmount(invoiceItem.price * invoiceItem.qty),
    });
  };

  const calculateItemTotalAmount = (subtotal) => {
    let discountedAmount = subtotal - subtotal * (invoiceItem.discount / 100);
    let taxCalAmount =
      discountedAmount + discountedAmount * (invoiceItem.tax_applied / 100);

    return taxCalAmount.toFixed(2);
  };
  useEffect(() => {
    // console.log(
    //   "DAtes from changes",
    //   getValues(["from_date"])[0][0],
    //   getValues(["to_date"])[0][0]
    // );
    // getValues(["from_date"])[0][0].valueOf();
    if (
      getValues(["to_date"])[0][0]?.valueOf() -
        getValues(["from_date"])[0][0]?.valueOf() <
      1296000000
    ) {
      setPaymentcycle([{ value: "7", label: "Every 7 Days" }]);
    } else if (
      getValues(["to_date"])[0][0]?.valueOf() -
        getValues(["from_date"])[0][0]?.valueOf() >
        1296000000 &&
      getValues(["to_date"])[0][0]?.valueOf() -
        getValues(["from_date"])[0][0]?.valueOf() <
        2678400000
    ) {
      setPaymentcycle([
        { value: "7", label: "Every 7 Days" },
        { value: "15", label: "Every 15 Days" },
      ]);
    } else if (
      [
        getValues(["to_date"])[0][0]?.valueOf() -
          getValues(["from_date"])[0][0]?.valueOf() >
          2678400000,
      ]
    ) {
      setPaymentcycle([
        { value: "7", label: "Every 7 Days" },
        { value: "15", label: "Every 15 Days" },
        { value: "30", label: "Every 30 Days" },
      ]);
    }
  }, [getValues(["from_date"])[0], getValues(["to_date"])[0]]);

  const calculateGrandTotal = () => {
    const subtotal = invoiceItemsList?.reduce(
      (total, currentValue) => (total = total + currentValue.subtotal),
      0
    );
    const discount = invoiceItemsList?.reduce(
      (total, currentValue) =>
        (total = total + parseFloat(currentValue.discount)),
      0
    );
    const tax_applied = invoiceItemsList?.reduce(
      (total, currentValue) =>
        (total = total + parseFloat(currentValue.tax_applied)),
      0
    );

    let discountedAmount = subtotal - subtotal * (discount / 100);
    let taxCalAmount =
      discountedAmount + discountedAmount * (tax_applied / 100);
    let totalAmount = 0;
    {
      invoiceItemsList.map((item) => (totalAmount += parseFloat(item.total)));
    }

    //console.log(totalAmount);
    return totalAmount.toFixed(2);
  };
  const styles = {
    multiValue: (base, state) => {
      return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed
        ? { ...base, color: "#626262", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  useEffect(() => {
    // console.log(
    //   "watch",
    //   watch(),
    //   getValues(["invoice_type"])[0],
    //   getFieldState("from_date")
    // );
    watch();
    getValues(["invoice_type"])[0] == "R"
      ? setInvoiceTypeSelect(getValues(["invoice_type"])[0])
      : setInvoiceTypeSelect(getValues(["invoice_type"])[0]);
  }, [getValues(["invoice_type"])[0]]);
  const [checkCurrencyType, setcheckCurrencyType] = useState([]);
  useEffect(() => {}, [checkCurrencyType]);
  // console.log("console", checkCurrencyType, getValues(["invoice_type"]));

  return (
    <div>
      <Card
        title={
          location.pathname.split("/")[1] === "invoice-edit"
            ? "Edit invoice"
            : "Create new invoice"
        }
      >
        {location.pathname.split("/")[1] === "invoice-edit" ? (
          <h4 className="text-slate-900 dark:text-white text-xl mb-4">
            #{invoiceRef}
          </h4>
        ) : (
          ""
        )}

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
              <div>
                <label htmlFor="default-picker" className="form-label">
                  Invoice Date
                </label>

                <Flatpickr
                  className="form-control placeholder:text-slate-900 changeBackground  py-2 bg-white"
                  value={picker}
                  onChange={(date) => setPicker(date[0])}
                  id="default-picker"
                />
              </div>

              <Select
                label="Currency"
                name="currency_id"
                id="currency_id"
                register={register}
                defaultValue={"Choose currency"}
                options={currencyList}
                onChange={(e) => setcheckCurrencyType(e.target.value)}
                error={errors?.currency_id}
                // className={`react-select mt-2 $`}
              />

              <Select
                label=" Invoice Type"
                name="invoice_type"
                id="invoice_type"
                register={register}
                defaultValue={"Choose Invoice Type"}
                options={invoiceType}
                error={errors?.invoice_type}
                // className={`react-select mt-2 $`}
              />
              {/* <label className="form-label" htmlFor="mul_1">
                Invoice Type
                <Controller
                  name="invoice_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={invoiceType}
                      isClearable={false}
                      styles={styles}
                      closeMenuOnSelect={true}
                      className={`react-select mt-2 ${
                        errors?.invoice_type
                          ? "outline-none border border-red-900"
                          : "outline-none"
                      }`}
                      classNamePrefix="select"
                      id="mul_1"
                    />
                  )}
                />
                {errors.invoice_type && (
                  <div className={` text-danger-500 block text-sm`}>
                    {errors.invoice_type?.message}
                  </div>
                )}
              </label> */}
            </div>
            {invoiceTypeSelect === "R" && (
              <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mt-4">
                <div>
                  <label className="form-label" htmlFor="mul_1">
                    Subscription start date
                    <Controller
                      name="from_date"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Flatpickr
                          {...field}
                          options={{
                            altInput: true,
                            enableTime: false,
                            minDate: "today",
                          }}
                          className={` form-control changeBackground py-2 bg-white mt-2 ${
                            errors?.from_date
                              ? "outline-none border border-danger-500"
                              : "outline-none"
                          }`}
                          placeholder="Choose subscription start date"
                        />
                      )}
                    />
                    {errors.from_date && (
                      <div className={` text-danger-500 block text-sm`}>
                        {errors.from_date?.message}
                      </div>
                    )}
                  </label>
                </div>
                <label className="form-label" htmlFor="mul_1">
                  Subscription end date
                  <Controller
                    name="to_date"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        options={{
                          altInput: true,
                          enableTime: false,
                          minDate:
                            getValues(["from_date"])[0][0] &&
                            getValues(["from_date"])[0][0].fp_incr(7),
                        }}
                        className={` form-control changeBackground py-2 bg-white mt-2 ${
                          errors?.to_date
                            ? "outline-none border border-danger-500"
                            : "outline-none"
                        }`}
                        placeholder="Choose subscription end date"
                      />
                    )}
                  />
                  {errors.to_date && (
                    <div className={` text-danger-500 block text-sm`}>
                      {errors.to_date?.message}
                    </div>
                  )}
                </label>

                <Select
                  label="Payment Cycle"
                  name="payment_cycle"
                  id="payment_cycle"
                  register={register}
                  defaultValue={"Choose Payment Cycle"}
                  options={paymentcycle}
                  error={errors?.payment_cycle}
                  // className={`react-select mt-2 $`}
                />
              </div>
            )}
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-5 my-5">
              <Textinput
                label="Customer Name*"
                className=" after:content-['_↗']"
                type="text"
                id="name"
                name="name"
                register={register}
                error={errors.name}
                placeholder="Add your name"
              />
              <Textinput
                label="Customer Email*"
                type="email"
                id="email"
                name="email"
                register={register}
                error={errors.email}
                placeholder="Add your email"
              />
              {/* <Textinput
                label="Phon"
                type="text"
                id="phone"
                name="phone"
                register={register}
                error={errors.phone}
                placeholder="Add your phone"
              /> */}
              <InputPhone
                label="Customer Phone (optional)"
                id="phoneInputWithCountrySelect"
                name="phoneInputWithCountrySelect"
                // phone={phone}
                control={control}
                // setPhone={setPhone}
                // register={register}
                error={errors.phoneInputWithCountrySelect}
                // className="border-none text-sm"
              />
              <Textinput
                label="Customer Address (optional)"
                type="text"
                id="address"
                name="address"
                register={register}
                error={errors.address}
                placeholder="Add your address"
              />
            </div>
            <div className="col-span-full">
              <div className="w-1/2">
                <Textarea
                  label="Additional Note"
                  type="text"
                  rows="2"
                  id="inv_description"
                  name="inv_description"
                  register={register}
                  error={errors.inv_description}
                  placeholder="Add your additional note."
                />
              </div>
            </div>
            <div className="col-span-full mt-5">
              <div className="flex justify-between items-center gap-5 py-4 md:px-6 px-2.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 border-slate-200">
                <h4 className="text-slate-900 dark:text-white text-xl  ">
                  Invoice Items
                </h4>
                <p
                  className="text-xs py-2 px-4 rounded border shadow-md cursor-pointer  dark:border-slate-700 border-slate-200 dark:bg-slate-900"
                  onClick={() => resetItemFields()}
                >
                  Clear
                </p>
              </div>

              <div className="flex items-start gap-6 bg-slate-50 dark:bg-slate-800 mb-6 md:p-6 p-2.5 shadow">
                <div className="w-full lg:grid-cols-7 md:grid-cols-2 grid-cols-1 grid gap-x-5 gap-y-4 mb-5 last:mb-0">
                  <Textinput
                    label="Description"
                    type="text"
                    row="5"
                    id={`item_name`}
                    placeholder="Add item description."
                    className={`${
                      itemErrors.description &&
                      !invoiceItem.description &&
                      "border-danger-500 focus:ring-danger-500 h-full"
                    }`}
                    inputName={`description`}
                    defaultValue={invoiceItem.description}
                    onChange={handleItemInputs}
                  />

                  <Textinput
                    label="Price (USD)"
                    type="number"
                    id={`item_price`}
                    placeholder="Add item price"
                    className={`${
                      itemErrors.price &&
                      !invoiceItem.price &&
                      "border-danger-500 focus:ring-danger-500"
                    }`}
                    inputName={`price`}
                    defaultValue={invoiceItem.price}
                    onChange={handleItemInputs}
                  />

                  <Textinput
                    label="Quantity"
                    type="number"
                    id={`item_qty`}
                    placeholder="Add item qty"
                    className={`${
                      itemErrors.qty &&
                      !invoiceItem.qty &&
                      "border-danger-500 focus:ring-danger-500"
                    }`}
                    inputName={`qty`}
                    defaultValue={invoiceItem.qty}
                    onChange={handleItemInputs}
                  />
                  <div>
                    <label className="font-medium text-sm">Subtotal</label>
                    <div
                      className={`${
                        itemErrors.subtotal &&
                        !invoiceItem.subtotal &&
                        "border-danger-500 focus:ring-danger-500"
                      } dark:border-slate-700 bg-white dark:bg-slate-900 border-slate-200 h-[38px] w-full border rounded px-3 py-2 mt-2 text-sm`}
                    >
                      {invoiceItem.subtotal}
                    </div>
                  </div>
                  <Textinput
                    label="Discount %"
                    type="number"
                    id={`item_discount`}
                    placeholder="Add item discount"
                    className={`${
                      itemErrors.discount &&
                      !invoiceItem.discount &&
                      "border-danger-500 focus:ring-danger-500"
                    }`}
                    inputName={`discount`}
                    defaultValue={invoiceItem.discount}
                    onChange={handleItemInputs}
                  />
                  <Textinput
                    label="Vat %"
                    type="number"
                    id={`item_tax`}
                    placeholder="Add item tax"
                    className={`${
                      itemErrors.tax_applied &&
                      !invoiceItem.tax_applied &&
                      "border-danger-500 focus:ring-danger-500"
                    }`}
                    inputName={`tax_applied`}
                    defaultValue={invoiceItem.tax_applied}
                    onChange={handleItemInputs}
                  />
                  <div>
                    <label className="font-medium text-sm">Total</label>
                    <div
                      className={`${
                        itemErrors.total &&
                        !invoiceItem.total &&
                        "border-danger-500 focus:ring-danger-500"
                      } bg-white dark:bg-slate-900 dark:border-slate-700 border-slate-200 h-[38px] w-full border rounded px-3 py-2 mt-2 text-sm`}
                    >
                      {invoiceItem.total}
                    </div>
                  </div>
                </div>
              </div>
              {editBlock ? (
                <div className="col-span-full mt-4 mx-6"></div>
              ) : (
                <div className="col-span-full mt-4 md:mx-6 mx-2.5">
                  {isEdit ? (
                    <div className="flex items-center gap-4">
                      <Button
                        text="Update Invoice Item"
                        type="button"
                        // icon="heroicons-outline:plus"
                        className="border px-4 py-2 text-xs hover:shadow text-white font-normal bg-primary-500"
                        onClick={() => updateItem()}
                        isLoading={isLoading}
                      />
                      <Button
                        text="Cancel"
                        type="button"
                        // icon="heroicons-outline:plus"
                        className="border px-4 py-2 text-xs hover:shadow text-slate-600 p-0 dark:text-slate-300"
                        onClick={() => resetItemFields()}
                      />
                    </div>
                  ) : (
                    <Button
                      text="Add Invoice Item"
                      type="button"
                      icon="heroicons-outline:plus"
                      className="text-slate-100 bg-slate-900 border dark:border-slate-600 p-2 text-xs hover:shadow dark:text-slate-200"
                      onClick={() => (addItem(), resetItemFields())}
                    />
                  )}
                </div>
              )}
              {invoiceItemsList?.length ? (
                <section>
                  <InvoiceItemTable
                    editBlock={editBlock}
                    itemsList={invoiceItemsList}
                    setItemsList={setInvoiceItemsList}
                    setInvoiceItem={setInvoiceItem}
                    setIsEdit={setIsEdit}
                    isEdit={isEdit}
                    setEditItemIndex={setEditItemIndex}
                    getSingleInvoice={getSingleInvoice}
                  />
                </section>
              ) : (
                ""
              )}

              {/* Item Calculations */}
              {invoiceItemsList?.length > 0 && (
                <>
                  <div className="py-2 ml-auto mt-5 mb-5">
                    <div className="flex justify-between mb-3">
                      <div className="dark:text-slate-300 text-gray-800 text-right flex-1">
                        Sub Total:
                      </div>
                      <div className="text-right w-40">
                        <div className=" dark:text-slate-300 text-gray-800 font-medium">
                          {invoiceItemsList?.reduce(
                            (total, currentValue) =>
                              (total = total + currentValue.subtotal),
                            0
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mb-4">
                      <div className="text-sm dark:text-slate-300 text-gray-800 text-right flex-1">
                        Discount %:
                      </div>
                      <div className="text-right w-40">
                        <div className="text-sm dark:text-slate-300 text-gray-800">
                          {invoiceItemsList?.reduce(
                            (total, currentValue) =>
                              (total =
                                total + parseFloat(currentValue.discount)),
                            0
                          )}
                          %
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="text-sm dark:text-slate-300 text-gray-800 text-right flex-1">
                        Vat %:
                      </div>
                      <div className="text-right w-40">
                        <div className="text-sm dark:text-slate-300 text-gray-800">
                          {invoiceItemsList?.reduce(
                            (total, currentValue) =>
                              (total =
                                total + parseFloat(currentValue.tax_applied)),
                            0
                          )}
                          %
                        </div>
                      </div>
                    </div>

                    <div className="py-2 relative border-t border-b">
                      <div className="flex justify-between">
                        <div className="text-xl dark:text-slate-300 text-gray-800 text-right flex-1 font-medium">
                          Grand Total:
                        </div>
                        <div className="text-right  w-40">
                          <div className="text-xl  dark:text-slate-300 text-gray-800 font-bold">
                            {calculateGrandTotal()}
                            {/* {currencyList.map((data) => {
                              if (data?.value == getValues(["currency_id"])) {
                                if (
                                  calculateGrandTotal() < 100 &&
                                  data?.label !== "Tether TRC20"
                                ) {
                                  return (
                                    <p className="text-xs text-danger-500 absolute top-12 font-medium right-0">
                                      *Your invoice amount is less than 100 USD,
                                      you can only select Tether TRC20 token for
                                      this payment.
                                    </p>
                                  );
                                }
                              }
                            })} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {editBlock ? (
                    <div className="col-span-full flex justify-end"></div>
                  ) : (
                    <div className="col-span-full flex justify-end">
                      <Button
                        type="submit"
                        text={
                          location.pathname.split("/")[1] === "invoice-edit"
                            ? "Update Invoice"
                            : "Generate Invoice"
                        }
                        className="btn-success"
                        
                        // onClick={() => console.log("data updates")}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </form>
        </div>
      </Card>
      {
        <Modal
          title={`Payment Link`}
          showModal={paymentUrl}
          setShowModal={setPaymentUrl}
          uncontrol
          footerContent={
            <>
              <Button
                text="Send email"
                isLoading={isLoading}
                className="btn-dark "
                onClick={() => sendReturnUrlEmail(return_url?.uuid)}
              />
            </>
          }
        >
          {isLoading && <Loader position="absolute" />}
          <div className="w-full mx-auto">
            <div className="w-[20%] mx-auto">
              <img
                src={Logo}
                alt={"Logo"}
                height="auto"
                className="!inline-block mb-1"
              />
            </div>
            <hr></hr>
            <div className="font-bold text-center ">E-supplier</div>
            <div className="text-slate-600 flex justify-between mt-5 items-center dark:text-slate-300 text-sm w-full">
              <div className="w-[90%] ">
                <div
                  className="text-blue-900 cursor-pointer whitespace-nowrap break-after-column text-ellipsis overflow-hidden font-medium "
                  onClick={() =>
                    window.open(
                      VITE_SITE_URL + return_url?.paymentlink,
                      "_blank"
                    )
                  }
                >
                  {VITE_SITE_URL + return_url?.paymentlink}
                </div>
              </div>
              <div className="w-[10%] pl-3">
                {copyPaymentUrl ? (
                  <img
                    src={Check}
                    alt={"copy text"}
                    height={15}
                    width={15}
                    className="filter invert "
                  />
                ) : (
                  <img
                    src={Copytexticon}
                    alt={"copy text"}
                    height={14}
                    width={14}
                    className={`cursor-pointer`}
                    onClick={() => (
                      navigator.clipboard.writeText(
                        VITE_SITE_URL + return_url?.paymentlink
                      ),
                      setCopyPaymentUrl(true),
                      setTimeout(() => {
                        setCopyPaymentUrl(false);
                      }, 6000)
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </Modal>
      }
    </div>
  );
};

export default InvoiceAddPage;
