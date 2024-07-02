import React, { useEffect, useState } from "react";
import Textinput from "../Textinput";
import Button from "../Button";
import Modal from "../Modal";
import Checkbox from "../Checkbox";
import Loader from "@/components/Loader";
import { useSelector } from "react-redux";
import ProductItem from "./ProductItem";
import { getAllProducts } from "../../../pages/product/store/actions";
import { useDispatch } from "react-redux";
import { setAllProduct } from "../../../pages/product/store/store";
import { ON_LOADING } from "@/store/loader";
import Switch from "../Switch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import image1 from "@/assets/images/dummy.png";
import DropzoneComponents from "@/components/ui/DropzoneComponents";

const EditModel = ({
  product,
  setProduct,
  isEditModal,
  setIsEditModal,
  updateProductDetails,
  modalName,
  addProduct,
  deleteConfrim,
  productList,
}) => {
  const dispatch = useDispatch();
  console.log(product);
  useEffect(() => {
    // fetchProducts();

    if (modalName === "add") {
      (product.password = ""), resetProduct();
    } else {
      delete product.password;
    }
  }, []);
  const { isLoading } = useSelector((state) => state.loader);
  const { allProducts } = useSelector((state) => state.products);
  const [forAdmin, setForAdmin] = useState(product.for_admin == 1 ? true : false);
  const [forVendor, setForVendor] = useState(
    product.for_vendor == 1 ? true : false
  );
  const handleInputs = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const setCheckbox = (e) => {
    // console.log(e.target.checked);
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked ? 1 : 0,
    }));
  };
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState([]);
  const [profilesData, setProfilesData] = useState({ preview: "", name: "" });
  const setFiless = (data) => {
    setFile(data);
    //console.log(data);
  };
  // useEffect(() => {
  //   const files = {
  //     preview: product?.profile_image,
  //     name: product?.name,
  //   };
  //   setProfilesData(files);
  // }, []);
  console.log("Image profile", file);
  const validateForm = () => {
    const error = {};
    let valid = true;
    const userName = /[a-zA-Z\s]{3,}/;
    const price = /^\d+(\.\d+)?$/;
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneNumberPattern =
      /^(?:\+?\d{1,3})?[ -]?\(?(?:\d{2,3})\)?[ -]?\d{3}[ -]?\d{4}$/;

    if (!product?.name) {
      error.name = "Name is required";
      valid = false;
    } else if (!userName.test(product?.name)) {
      error.name = "Name should be minimum 3 letters";
      valid = false;
    }
    if (!product?.description) {
      error.description = "Description is required";
      valid = false;
    }
    if (!product?.status) {
      error.status = " Status is required";
      valid = false;
    }
    if (!product?.image) {
      error.status = " Image is required";
      valid = false;
    }
    setErrors(error);
    return valid;
  };
  const resetProduct = () => {
    setProduct({
      name: "",
      description: "",
      image: 0,
      status: "",
      id: "",
    });
  };
  // const fetchProducts = async () => {
  //   dispatch(ON_LOADING(true));

  //   await getAllProducts().then((data) => {
  //     dispatch(ON_LOADING(false));
  //     data && dispatch(setAllProduct(data));
  //   });
  // };
  return (
    <Modal
      title={`${modalName} Product`}
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
                  updateProductDetails();
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
                  addProduct();
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
          defaultValue={product?.name}
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
            value={product?.description}
            onChange={(e) => setProduct((prev) => ({ ...prev, description: e }))}
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

        {/* {allProducts.map((product1, key) => (
          <ProductItem
            key={key}
            products={product1}
            product={product}
            setProduct={setProduct}
          />
        ))} */}
        <div className="space-y-2.5">
          <h1 className="font-bold text-base">Product status</h1>
          <Switch
            label="Status"
            value={product?.status !== "active" ? 0 : 1}
            onChange={() =>
              setProduct((prev) => ({
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
