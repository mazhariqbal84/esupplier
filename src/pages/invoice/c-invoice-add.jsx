import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Icon from "@/components/ui/Icon";
import Repeater from "./Repeater";
import Flatpickr from "react-flatpickr";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ApiService from "../../store/services/api.service";
import { toast } from "react-toastify";
import Select from "../../components/ui/Select";
import { useEffect } from "react";
import InvoiceItemTable from "../../components/ui/invoices/InvoiceItemTable";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ON_LOADING } from "@/store/loader";
import Alert from "@/components/ui/Alert";
const InvoiceAddPage = () => {
  const FormValidationSchema = yup
    .object({
      currency_id: yup.string().required("Currency is required"),
      name: yup.string().required("Name is required"),
      email: yup.string().required("Email is required"),
      phone: yup.string().required("Phone is required"),
      address: yup.string().required("Address is required"),
      inv_description: yup.string().required("Invoice description is required"),
      invoice_type: yup.string().required("Invoice type is required"),
    })
    .required();

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
    defaultValues: {
      currency_id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      inv_description: "",
      invoice_type: "",
    },
  });

  const dispatch = useDispatch();

  // ///////////////////      States      ///////////////////
  const invoiceType = [
    { value: "S", label: "Sale" },
    { value: "R", label: "Recursion" },
  ];
  const paymentcycle = [
    { value: "7", label: "Every 7 Days" },
    { value: "15", label: "Every 15 Days" },
    { value: "30", label: "Every 30 Days" },
  ];
  const date = new Date(); // Now
  const thirdydate = date.setDate(date.getDate() + 365);
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
  const [invoiceTypeSelect, setInvoiceTypeSelect] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getCurrencyList();
    location.pathname.split("/")[1] === "invoice-edit"
      ? getSingleInvoice()
      : setInvoiceDetails(null);
  }, [navigate]);

  useEffect(() => {
    if (InvoiceDetails) {
      setInvoiceItemsList(InvoiceDetails?.details);
      setPicker(InvoiceDetails?.issued_date);
      setInvoiceRef(InvoiceDetails?.invoice_ref);
      setValue("currency_id", InvoiceDetails?.currency_id);
      setValue("name", InvoiceDetails?.name);
      setValue("email", InvoiceDetails?.email);
      setValue("phone", InvoiceDetails?.phone);
      setValue("address", InvoiceDetails?.address);
      setValue("inv_description", InvoiceDetails?.inv_description);
      setInvoiceTypeSelect(InvoiceDetails?.invoice_type);
    }
  }, [InvoiceDetails]);

  const handleChange = (e) => {
    setInvoiceTypeSelect(e.target.value);
  };
  const getCurrencyList = () => {
    ApiService.setHeader();
    ApiService.get(`api/get-currencies-list-for-payment`).then((result) => {
      if (result?.data?._metadata?.outcome === "SUCCESS") {
        setCurrencyList(result?.data?.records);
      }else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
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
      }else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
        window.open("/package-expire", "_self");
      } else {
        toast.error(result?.data?.errors[0]);
      }
    });
  };

  const onSubmit = (data) => {
    //console.log('on submit data => ', data);
    const date = new Date(picker);
    data.issued_date =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    if (location.pathname.split("/")[1] === "invoice-edit") {
      ApiService.setHeader();
      ApiService.post(
        `api/internal-invoices/update-invoice/${
          location.pathname.split("/")[2]
        }`,
        data
      ).then((result) => {
        if (result?.data?._metadata?.outcome === "SUCCESS") {
          toast.success("Internal Invoice updated successfully.");
          navigate("/invoices");
          // setInvoiceItemsList([])
          // resetItemFields()
          // reset()
        }else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
          window.open("/package-expire", "_self");
        } else {
          toast.error(result?.data?.errors[0]);
        }
      });
    } else {
      if (invoiceItemsList.length) {
        data.invoice_items = invoiceItemsList;

        ApiService.setHeader();
        ApiService.post(`api/internal-invoices/create-invoice`, data).then(
          (result) => {
            if (result?.data?._metadata?.outcome === "SUCCESS") {
              toast.success("Internal Invoice created successfully.");
              setInvoiceItemsList([]);
              resetItemFields();
              reset();
            }else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
              window.open("/package-expire", "_self");
            } else {
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
          }else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          } else {
            toast.error(result?.data?.errors[0]);
          }
        });
        setIsLoading(false);
      } else {
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
          }else {
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
                  className="form-control py-2 bg-white"
                  value={picker}
                  onChange={(date) => setPicker(date[0])}
                  id="default-picker"
                />
              </div>
              <Select
                label="Currency"
                options={currencyList}
                register={register}
                defaultValue={"Choose currency"}
                error={errors.currency_id}
                id="currency_id"
                name="currency_id"
              />
              <Select
                label="Invoice type"
                options={invoiceType}
                register={register}
                onChange={handleChange}
                defaultValue={"Choose Type"}
                error={errors.invoice_type}
                id="invoice_type"
                value={invoiceTypeSelect}
              />
              {/* <Select
                label="Basic Select"
                options={invoiceType}
                onChange={handleChange}
              //value={value}
              /> */}
            </div>
            {invoiceTypeSelect === "R" && (
              <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mt-4">
                <div>
                  <label htmlFor="default-picker" className="form-label">
                    From Date
                  </label>

                  <Flatpickr
                    className="form-control py-2 bg-white"
                    value={pickerFrom}
                    onChange={(date) => setPickerFrom(date[0])}
                    id="default-picker"
                  />
                </div>
                <div>
                  <label htmlFor="default-picker" className="form-label">
                    To Date
                  </label>
                  <Flatpickr
                    className="form-control py-2 bg-white"
                    value={pickerTo}
                    onChange={(date) => setPickerTo(date[0])}
                    id="default-picker"
                  />
                </div>
                <Select
                  label="Payment Cycle"
                  options={paymentcycle}
                  register={register}
                  defaultValue={30}
                  error={errors.payment_ycle}
                  id="payment_cycle"
                  name="payment_ycle"
                />
              </div>
            )}
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-5 my-5">
              <Textinput
                label="Name"
                type="text"
                id="name"
                name="name"
                register={register}
                error={errors.name}
                placeholder="Add your name"
              />
              <Textinput
                label="Email"
                type="email"
                id="email"
                name="email"
                register={register}
                error={errors.email}
                placeholder="Add your email"
              />
              <Textinput
                label="Phone"
                type="text"
                id="phone"
                name="phone"
                register={register}
                error={errors.phone}
                placeholder="Add your phone"
              />
              <Textinput
                label="Address"
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
              <div className="flex justify-between items-center gap-5 py-4 md:px-6 px-2.5 bg-slate-50 dark:bg-slate-800 border  dark:border-slate-700 border-slate-200">
                <h4 className="text-slate-900 dark:text-white text-xl  ">
                  Invoice Items
                </h4>
                <p
                  className="text-xs py-2 px-4 rounded border shadow-md cursor-pointer bg-white dark:border-slate-700 border-slate-200 dark:bg-slate-900"
                  onClick={() => resetItemFields()}
                >
                  Clear
                </p>
              </div>

              <div className="flex items-start gap-6 bg-slate-50  dark:bg-slate-800 mb-6 p-6 shadow">
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
                    label="Price"
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
                    label="Qty"
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
                    label="Discount"
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
                    label="Tax"
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
                      } dark:border-slate-700 bg-white dark:bg-slate-900 border-slate-200 h-[38px] w-full border rounded px-3 py-2 mt-2 text-sm`}
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
                        text="Update"
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
                      text="Add new"
                      type="button"
                      icon="heroicons-outline:plus"
                      className="text-slate-600 p-0 dark:text-slate-300"
                      onClick={() => addItem()}
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
              <div className="py-2 ml-auto mt-5 mb-5">
                <div className="flex justify-between mb-3">
                  <div className="text-gray-800 text-right flex-1">
                    Sub Total:
                  </div>
                  <div className="text-right w-40">
                    <div className="text-gray-800 font-medium">
                      {invoiceItemsList?.reduce(
                        (total, currentValue) =>
                          (total = total + currentValue.subtotal),
                        0
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mb-4">
                  <div className="text-sm text-gray-600 text-right flex-1">
                    Discount:
                  </div>
                  <div className="text-right w-40">
                    <div className="text-sm text-gray-600">
                      {invoiceItemsList?.reduce(
                        (total, currentValue) =>
                          (total = total + parseFloat(currentValue.discount)),
                        0
                      )}
                      %
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mb-4">
                  <div className="text-sm text-gray-600 text-right flex-1">
                    Tax:
                  </div>
                  <div className="text-right w-40">
                    <div className="text-sm text-gray-600">
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

                <div className="py-2 border-t border-b">
                  <div className="flex justify-between">
                    <div className="text-xl text-gray-600 text-right flex-1 font-medium">
                      Grand Total:
                    </div>
                    <div className="text-right w-40">
                      <div className="text-xl text-gray-800 font-bold">
                        {calculateGrandTotal()}
                      </div>
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
                      ? "Update"
                      : "Save"
                  }
                  className="btn-dark"
                />
              </div>
            )}
          </form>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceAddPage;
