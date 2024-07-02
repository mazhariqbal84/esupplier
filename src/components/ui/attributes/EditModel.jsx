import React, { useEffect, useState } from "react";
import Textinput from "../Textinput";
import Button from "../Button";
import Modal from "../Modal";
import Checkbox from "../Checkbox";
import Loader from "@/components/Loader";
import { useSelector } from "react-redux";
import AttributeItem from "./AttributeItem";
import { getAllAttributes } from "../../../pages/attribute/store/actions";
import { useDispatch } from "react-redux";
import { setAllAttribute } from "../../../pages/attribute/store/store";
import { ON_LOADING } from "@/store/loader";
import Switch from "../Switch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select, { components } from "react-select";

const EditModel = ({
  attribute,
  setAttribute,
  isEditModal,
  setIsEditModal,
  updateAttributeDetails,
  modalName,
  addAttribute,
  deleteConfrim,
  attributeList,
}) => {
  const dispatch = useDispatch();
  console.log(attribute);
  useEffect(() => {
    // fetchAttributes();

    if (modalName === "add") {
      (attribute.password = ""), resetAttribute();
    } else {
      delete attribute.password;
    }
  }, []);
  const { isLoading } = useSelector((state) => state.loader);
  const { allAttributes } = useSelector((state) => state.attributes);

  const handleInputs = (e) => {
    setAttribute((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState([]);
  const [attributes, setAttributes] = useState("");
  const [profilesData, setProfilesData] = useState({ preview: "", name: "" });
  const setFiless = (data) => {
    setAttribute((prev) => ({
      ...prev,
      image: data,
    }));
    // setFile(data);
    //console.log(data);
  };
  useEffect(() => {
    const files = {
      preview: attribute?.image,
      name: attribute?.name,
    };
    setProfilesData(files);
  }, []);
  // console.log("Image profile", attribute);
  const validateForm = () => {
    const error = {};
    let valid = true;
    const userName = /[a-zA-Z\s]{3,}/;
    const price = /^\d+(\.\d+)?$/;
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneNumberPattern =
      /^(?:\+?\d{1,3})?[ -]?\(?(?:\d{2,3})\)?[ -]?\d{3}[ -]?\d{4}$/;

    if (!attribute?.name) {
      error.name = "Name is required";
      valid = false;
    } else if (!userName.test(attribute?.name)) {
      error.name = "Name should be minimum 3 letters";
      valid = false;
    }
    if (!attribute?.display_name) {
      error.display_name = "Display Name is required";
      valid = false;
    }
    if (!attribute?.options) {
      error.options = " Options type is required";
      valid = false;
    }
    if (!attribute?.values) {
      error.values = " Value is required";
      valid = false;
    }
    if (!attribute?.status) {
      error.status = " Status is required";
      valid = false;
    }
    setErrors(error);
    return valid;
  };
  const resetAttribute = () => {
    setAttribute({
      name: "",
      display_name: "",
      options: "",
      values: [],
      status: "",
      id: "",
    });
  };
  const styles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
  };
  const handleCoinSelection = (e) => {
    setAttribute((prev) => ({ ...prev, options: e }));
  };
  const optionSelection = [
    {
      label: "dropdown",
      value: "dropdown",
    },
    {
      label: "radio",
      value: "radio",
    },
  ];
  console.log("values::", attributes);
  // const fetchAttributes = async () => {
  //   dispatch(ON_LOADING(true));

  //   await getAllAttributes().then((data) => {
  //     dispatch(ON_LOADING(false));
  //     data && dispatch(setAllAttribute(data));
  //   });
  // };
  return (
    <Modal
      title={`${modalName} Attribute`}
      showModal={isEditModal}
      setShowModal={setIsEditModal}
      uncontrol
      footerContent={
        <>
          <Button
            text="Cancel"
            className=" border-2 border-red-500 outline-red-500 btn-sm text-red-500"
            onClick={() => {
              setIsEditModal(!isEditModal);
            }}
          />
          {modalName === "update" ? (
            <Button
              text="Update"
              className="btn-success btn-sm"
              isLoading={deleteConfrim}
              onClick={() => {
                if (validateForm()) {
                  updateAttributeDetails();
                }
                // setIsEditModal(!isEditModal),
              }}
            />
          ) : (
            <Button
              text="Add"
              className="btn-success btn-sm"
              isLoading={deleteConfrim}
              onClick={() => {
                if (validateForm()) {
                  addAttribute();
                }
                // setIsEditModal(!isEditModal),
              }}
            />
          )}
        </>
      }
    >
      {isLoading && <Loader position="absolute" />}

      <div className="flex flex-col gap-2 text-base text-slate-600 dark:text-slate-300">
        <Textinput
          label="Name"
          type="text"
          inputName="name"
          defaultValue={attribute?.name}
          onChange={handleInputs}
          placeholder="Type name"
          error={errors.name}
          onKeyUp={validateForm}
        />
        <div className="lg:col-span-2 col-span-1">
          <label className="form-label text-xs text-slate-900" htmlFor="icon_s">
            Choose Value Type
          </label>
          <Select
            // isDisabled={coinDetails?.status === "closed"}
            className="react-select placeholder-text-xs placeholder:text-slate-900"
            classNamePrefix="select"
            // defaultValue={attribute?.options}
            value={attribute?.options}
            options={optionSelection}
            isLoading={isLoading}
            onChange={handleCoinSelection}
            placeholder="Select your values type"
            isClearable={false}
            id="hh23"
            styles={styles}
            error={errors.options}
          />
        </div>
        <div className="lg:col-span-2 col-span-1">
          <label className="form-label text-xs text-slate-900" htmlFor="icon_s">
            Add values
          </label>
          <div className="">
            <div className="flex gap-2 border rounded p-2 justify-between">
              <input
                className=" w-full text-sm outline-none"
                type="text"
                // inputName="values"
                value={attributes}
                // defaultValue={attributes}
                onChange={(e) => setAttributes(e.target.value)}
                placeholder="Type Attribute Value"
                error={errors.name}
                onKeyUp={validateForm}
              />
              {attributes && (
                <Button
                  className="btn-sm btn-dark"
                  onClick={() => {
                    setAttribute((prev) => ({
                      ...prev,
                      values: [...attribute?.values, attributes],
                    }));
                    setAttributes("");
                  }}
                >
                  Add
                </Button>
              )}
            </div>
            {attribute.values.length > 0 && (
              <div className="bg-gray-100 p-2.5 rounded">
                {attribute.values.map((data, id) => (
                  <ul
                    key={id}
                    className=" bg-slate-800 rounded mt-2 text-white text-xs px-2.5 py-1.5 flex gap-2.5 items-center"
                  >
                    <li className=" flex gap-5 justify-between w-full">
                      {data}{" "}
                      <span
                        className=" cursor-pointer"
                        onClick={() =>
                          setAttribute((prev) => ({
                            ...prev,
                            values: prev.values.filter((_, i) => i !== id),
                          }))
                        }
                      >
                        x
                      </span>{" "}
                    </li>
                  </ul>
                ))}
              </div>
            )}
          </div>
        </div>
        <Textinput
          label="Display Name"
          type="text"
          inputName="display_name"
          defaultValue={attribute?.display_name}
          onChange={handleInputs}
          placeholder="Type Display Name"
          error={errors.display_name}
          onKeyUp={validateForm}
        />

        {/* {allAttributes.map((attribute1, key) => (
          <AttributeItem
            key={key}
            attributes={attribute1}
            attribute={attribute}
            setAttribute={setAttribute}
          />
        ))} */}
        <div className="space-y-2.5">
          <h1 className="font-medium text-sm">Attribute status</h1>
          <Switch
            label="Status"
            value={attribute?.status !== "active" ? 0 : 1}
            onChange={() =>
              setAttribute((prev) => ({
                ...prev,
                status: prev.status === "active" ? "inactive" : "active",
              }))
            }
          />
        </div>
        {errors.status && (
          <div className={`text-danger-500 block text-sm`}>{errors.status}</div>
        )}
      </div>
    </Modal>
  );
};

export default EditModel;
