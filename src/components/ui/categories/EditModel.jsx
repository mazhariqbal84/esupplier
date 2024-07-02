import React, { useEffect, useState } from "react";
import Textinput from "../Textinput";
import Button from "../Button";
import Modal from "../Modal";
import Checkbox from "../Checkbox";
import Loader from "@/components/Loader";
import { useSelector } from "react-redux";
import CategoryItem from "./CategoryItem";
import { getAllCategories } from "../../../pages/category/store/actions";
import { useDispatch } from "react-redux";
import { setAllCategory } from "../../../pages/category/store/store";
import { ON_LOADING } from "@/store/loader";
import Switch from "../Switch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const categories = [
  {
    id: 10,
    name: "est",
    slug: "minus-qui-ipsa-eveniet-voluptatem-magni-sit-nesciunt",
    description:
      "Qui cupiditate laudantium quidem esse modi dolores. Dicta autem eum doloribus quia dolores illum. Repellendus qui nulla ipsam aut nam rerum sunt sit. Est occaecati optio impedit perspiciatis adipisci rerum nulla.",
    parent_id: null,
    status: "active",
    created_at: "2024-06-14T06:40:35.000000Z",
    updated_at: "2024-06-14T06:40:35.000000Z",
    deleted_at: null,
    children: [
      {
        id: 9,
        name: "quas",
        slug: "eum-temporibus-nesciunt-sunt-dolor-mollitia-totam",
        description:
          "Ut itaque natus est laborum. Et provident in dolor. Odit voluptatem in animi. Vero ut enim laboriosam vitae ut iste dolores.",
        parent_id: null,
        status: "active",
        created_at: "2024-06-14T06:40:35.000000Z",
        updated_at: "2024-06-14T06:40:35.000000Z",
        deleted_at: null,
        children: [
          {
            id: 8,
            name: "repellendus",
            slug: "laudantium-tempore-dolorem-quis-quisquam-eos-quis-veritatis",
            description:
              "Qui at molestias placeat omnis error. Enim provident autem inventore vero quas magnam laudantium consequuntur. Perspiciatis quis beatae id veniam recusandae error.",
            parent_id: null,
            status: "active",
            created_at: "2024-06-14T06:40:35.000000Z",
            updated_at: "2024-06-14T06:40:35.000000Z",
            deleted_at: null,
            children: [
              {
                id: 7,
                name: "perferendis",
                slug: "ex-voluptas-sunt-ipsa-placeat-et-perferendis-itaque",
                description:
                  "In consequatur sed voluptas voluptas facere temporibus aut repudiandae. Eum minus veritatis beatae iusto ipsam autem. Nulla rem numquam repellendus tempora.",
                parent_id: null,
                status: "active",
                created_at: "2024-06-14T06:40:35.000000Z",
                updated_at: "2024-06-14T06:40:35.000000Z",
                deleted_at: null,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 6,
        name: "consequatur",
        slug: "sit-perferendis-non-fugit-consequatur",
        description:
          "Harum sunt autem ex laboriosam beatae provident similique. Quos aperiam suscipit qui odio quae placeat. Assumenda natus repellendus beatae ipsam. Ullam numquam temporibus dolores ad quis voluptas explicabo minima.",
        parent_id: null,
        status: "active",
        created_at: "2024-06-14T06:40:35.000000Z",
        updated_at: "2024-06-14T06:40:35.000000Z",
        deleted_at: null,
        children: [],
      },
    ],
  },

  {
    id: 5,
    name: "ipsa",
    slug: "sed-explicabo-reprehenderit-rerum-necessitatibus-quas-recusandae-quia",
    description:
      "Dicta excepturi nihil pariatur. Dolorem consectetur perspiciatis asperiores quis optio fuga explicabo. A sed quo voluptatibus sapiente placeat alias est. Repudiandae sed alias eum et est et qui id.",
    parent_id: null,
    status: "active",
    created_at: "2024-06-14T06:40:35.000000Z",
    updated_at: "2024-06-14T06:40:35.000000Z",
    deleted_at: null,
    children: [],
  },
  {
    id: 4,
    name: "fugiat",
    slug: "et-illo-sit-eos",
    description:
      "Nihil sapiente qui porro et et corrupti voluptas. Dolore aut necessitatibus quia. Enim odio eos sunt corporis consequatur consequuntur in. Quae ipsum suscipit nihil aperiam.",
    parent_id: null,
    status: "active",
    created_at: "2024-06-14T06:40:35.000000Z",
    updated_at: "2024-06-14T06:40:35.000000Z",
    deleted_at: null,
    children: [],
  },
  {
    id: 3,
    name: "quaerat",
    slug: "exercitationem-non-illo-nam-facilis-voluptates-magnam-molestiae",
    description:
      "Quae voluptas eveniet ipsum laudantium quibusdam sit. Repudiandae quaerat minus facilis rerum recusandae voluptates. Dolore tempore totam officia ut odit. Est enim corrupti hic numquam quia. Asperiores quis odit enim repellendus voluptatem.",
    parent_id: null,
    status: "active",
    created_at: "2024-06-14T06:40:35.000000Z",
    updated_at: "2024-06-14T06:40:35.000000Z",
    deleted_at: null,
    children: [],
  },
  {
    id: 1,
    name: "odit",
    slug: "beatae-deleniti-quibusdam-sequi-nihil-inventore-consequuntur-quisquam-accusamus",
    description:
      "Beatae velit voluptas magni modi est. Adipisci neque excepturi cumque cumque cum. Eos neque voluptate aut placeat autem recusandae.",
    parent_id: null,
    status: "active",
    created_at: "2024-06-14T06:40:35.000000Z",
    updated_at: "2024-06-14T06:40:35.000000Z",
    deleted_at: null,
    children: [
      {
        id: 2,
        parent_id: 1,
        name: "quaerat",
        slug: "quia-quidem-iusto-temporibus-ut-quisquam",
        status: "active",
        children: [],
      },
    ],
  },
];
const EditModel = ({
  category,
  setCategory,
  isEditModal,
  setIsEditModal,
  updateCategoryDetails,
  modalName,
  addCategory,
  deleteConfrim,
  categoryList,
}) => {
  const dispatch = useDispatch();
  console.log(category);
  useEffect(() => {
    fetchCategories();

    if (modalName === "add") {
      (category.password = ""), resetCategory();
    } else {
      delete category.password;
    }
  }, []);
  const { isLoading } = useSelector((state) => state.loader);
  const { allCategories } = useSelector((state) => state.categories);
  const [forAdmin, setForAdmin] = useState(
    category.for_admin == 1 ? true : false
  );
  const [forVendor, setForVendor] = useState(
    category.for_vendor == 1 ? true : false
  );
  const handleInputs = (e) => {
    setCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const setCheckbox = (e) => {
    // console.log(e.target.checked);
    setCategory((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked ? 1 : 0,
    }));
  };
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const error = {};
    let valid = true;
    const userName = /[a-zA-Z\s]{3,}/;
    const price = /^\d+(\.\d+)?$/;
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneNumberPattern =
      /^(?:\+?\d{1,3})?[ -]?\(?(?:\d{2,3})\)?[ -]?\d{3}[ -]?\d{4}$/;

    if (!category?.name) {
      error.name = "Name is required";
      valid = false;
    } else if (!userName.test(category?.name)) {
      error.name = "Name should be minimum 3 letters";
      valid = false;
    }
    if (!category?.description) {
      error.description = "Description is required";
      valid = false;
    }
    if (!category?.status) {
      error.status = " Status is required";
      valid = false;
    }
    setErrors(error);
    return valid;
  };
  const resetCategory = () => {
    setCategory({
      name: "",
      description: "",
      parent_id: 0,
      status: "",
      id: "",
    });
  };
  const fetchCategories = async () => {
    dispatch(ON_LOADING(true));

    await getAllCategories().then((data) => {
      dispatch(ON_LOADING(false));
      data && dispatch(setAllCategory(data));
    });
  };
  return (
    <Modal
      title={`${modalName} Category`}
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
                  updateCategoryDetails();
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
                  addCategory();
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
          defaultValue={category?.name}
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
            value={category?.description}
            onChange={(e) =>
              setCategory((prev) => ({ ...prev, description: e }))
            }
            onKeyUp={validateForm}
          />
        </div>
        {errors.description && (
          <div className={`text-danger-500 block text-sm`}>
            {errors.description}
          </div>
        )}
        {allCategories.map((category1, key) => (
          <CategoryItem
            key={key}
            categories={category1}
            category={category}
            setCategory={setCategory}
          />
        ))}
        <div className="space-y-2.5">
          <h1 className="font-bold text-base">Category status</h1>
          <Switch
            label="Status"
            value={category?.status !== "active" ? 0 : 1}
            onChange={() =>
              setCategory((prev) => ({
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
