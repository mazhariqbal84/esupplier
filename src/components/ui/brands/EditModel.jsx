import React, { useEffect, useState } from "react";
import Textinput from "../Textinput";
import Button from "../Button";
import Modal from "../Modal";
import Checkbox from "../Checkbox";
import Loader from "@/components/Loader";
import { useSelector } from "react-redux";
import BrandItem from "./BrandItem";
import { getAllBrands } from "../../../pages/brand/store/actions";
import { useDispatch } from "react-redux";
import { setAllBrand } from "../../../pages/brand/store/store";
import { ON_LOADING } from "@/store/loader";
import Switch from "../Switch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import image1 from "@/assets/images/dummy.png";
import DropzoneComponents from "@/components/ui/DropzoneComponents";

const EditModel = ({
  brand,
  setBrand,
  isEditModal,
  setIsEditModal,
  updateBrandDetails,
  modalName,
  addBrand,
  deleteConfrim,
  brandList,
}) => {
  const dispatch = useDispatch();
  console.log(brand);
  useEffect(() => {
    // fetchBrands();

    if (modalName === "add") {
      (brand.password = ""), resetBrand();
    } else {
      delete brand.password;
    }
  }, []);
  const { isLoading } = useSelector((state) => state.loader);
  const { allBrands } = useSelector((state) => state.brands);

  const handleInputs = (e) => {
    setBrand((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState([]);
  const [profilesData, setProfilesData] = useState({ preview: "", name: "" });
  const setFiless = (data) => {
    setBrand((prev) => ({
      ...prev,
      image: data,
    }));
    // setFile(data);
    console.log(data);
  };
  useEffect(() => {
    const files = {
      preview: brand?.image,
      name: brand?.name,
    };
    setProfilesData(files);
  }, []);
  // console.log("Image profile", brand);
  const validateForm = () => {
    const error = {};
    let valid = true;
    const userName = /[a-zA-Z\s]{3,}/;
    const price = /^\d+(\.\d+)?$/;
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneNumberPattern =
      /^(?:\+?\d{1,3})?[ -]?\(?(?:\d{2,3})\)?[ -]?\d{3}[ -]?\d{4}$/;

    if (!brand?.name) {
      error.name = "Name is required";
      valid = false;
    } else if (!userName.test(brand?.name)) {
      error.name = "Name should be minimum 3 letters";
      valid = false;
    }
    if (!brand?.description) {
      error.description = "Description is required";
      valid = false;
    }
    if (!brand?.status) {
      error.status = " Status is required";
      valid = false;
    }
    // if (!brand?.image) {
    //   error.status = " Image is required";
    //   valid = false;
    // }
    setErrors(error);
    return valid;
  };
  const resetBrand = () => {
    setBrand({
      name: "",
      description: "",
      image: null,
      status: "",
      id: "",
    });
  };
  // const fetchBrands = async () => {
  //   dispatch(ON_LOADING(true));

  //   await getAllBrands().then((data) => {
  //     dispatch(ON_LOADING(false));
  //     data && dispatch(setAllBrand(data));
  //   });
  // };
  return (
    <Modal
      title={`${modalName} Brand`}
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
                  updateBrandDetails();
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
                  addBrand();
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
          defaultValue={brand?.name}
          onChange={handleInputs}
          placeholder="Type name"
          error={errors.name}
          onKeyUp={validateForm}
        />
        <div className="capitalize  text-slate-800 dark:text-slate-300 ">
          Description
        </div>
        <div className=" overflow-auto">
          <ReactQuill
            theme="snow"
            value={brand?.description}
            onChange={(e) => setBrand((prev) => ({ ...prev, description: e }))}
            onKeyUp={validateForm}
          />
        </div>
        {errors.description && (
          <div className={`text-danger-500 block text-sm`}>
            {errors.description}
          </div>
        )}
        <div className="capitalize  text-slate-800 dark:text-slate-300 ">
          Image
        </div>
        <DropzoneComponents setFiless={setFiless} fileData={profilesData} />

        {/* {allBrands.map((brand1, key) => (
          <BrandItem
            key={key}
            brands={brand1}
            brand={brand}
            setBrand={setBrand}
          />
        ))} */}
        <div className="space-y-2.5 w-max">
          <h1 className="font-bold text-base">Brand status</h1>
          <Switch
            label="Status"
            value={brand?.status !== "active" ? 0 : 1}
            onChange={() =>
              setBrand((prev) => ({
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
