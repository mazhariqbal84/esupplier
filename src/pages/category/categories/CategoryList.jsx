import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import {
  removeCategoriesError,
  setCategoriesErrors,
  setCategories,
  setCurrentPage,
} from "../store/store";
import { ON_LOADING } from "@/store/loader";
import Loader from "@/components/Loader";
import { useSelector, useDispatch } from "react-redux";
import CategoryTable from "@/components/ui/categories/CategoryTable";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import Confirmation from "@/components/ui/Confirmation";
import Button from "@/components/ui/Button";
import {
  setactiveModal,
  setdeleteConfrim,
  setDeleteAll,
} from "@/store/services/common/confirmation.module";
import EditModel from "@/components/ui/categories/EditModel";
import {
  addCategories,
  deleteCategories,
  getCategories,
  updateCategories,
  getCategory,
  getCategoryList,
} from "@/pages/category/store/actions";
import { toast } from "react-toastify";
const CategoryList = ({ title = "Manage Categories" }) => {
  const [modalName, setModalName] = useState("");

  const COLUMNS = [
    {
      Header: "Name",
      accessor: "name",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Parent Category Name",
      accessor: "parent",
      Cell: (row) => {
        return (
          <span>
            {row?.cell?.value?.name ? row?.cell?.value?.name : "main"}
          </span>
        );
      },
    },

    {
      Header: "status",
      accessor: "status",
      Cell: (row) => {
        return (
          <span
            className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              row?.cell?.value === "active"
                ? "text-success-500 bg-success-500"
                : ""
            }
                  ${
                    row?.cell?.value === "inactive"
                      ? "text-danger-500 bg-danger-500"
                      : ""
                  }
                   `}
          >
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "action",
      accessor: "id",
      Cell: (row) => {
        return (
          <div className="flex space-x-3 rtl:space-x-reverse">
            {/* <Tooltip content="View" placement="top" arrow animation="shift-away">
                            <button className="action-btn" type="button" onClick={(e) => viewRecord(row?.cell?.value)}>
                                <Icon icon="heroicons:eye" />
                            </button>
                        </Tooltip> */}
            <Tooltip
              content="Edit"
              placement="top"
              arrow
              animation="shift-away"
            >
              <button
                className="action-btn"
                type="button"
                onClick={(e) => (
                  editRecord(row?.cell?.row?.original), setModalName("update")
                )}
              >
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
            <Tooltip
              content="Delete"
              placement="top"
              arrow
              animation="shift-away"
              theme="danger"
            >
              <button
                className="action-btn"
                type="button"
                onClick={() => deleteConfirm(row)}
              >
                <Icon icon="heroicons:trash" />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const { isLoading } = useSelector((state) => state.loader);
  const { categories } = useSelector((state) => state.categories);
  const { itemsPerPage } = useSelector((state) => state.categories);
  const { currentPage } = useSelector((state) => state.categories);
  const { globalSearch } = useSelector((state) => state.categories);
  const { deleteConfrim } = useSelector((state) => state.confirmation);
  const { deleteAll } = useSelector((state) => state.confirmation);
  const [deleteRow, setDeleteRow] = useState(null);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [editRow, setEditRow] = useState({
    name: "",
    description: "",
    parent_id: 0,
    status: "",
    id: "",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    fetchCategories(handleParams());
  }, [itemsPerPage]);

  const handleParams = (page = currentPage, clearSearch = false) => {
    let params = [];
    params.page = page;
    params.itemsPerPage = itemsPerPage;
    params.sortDesc = "desc";
    params.query = clearSearch ? "" : globalSearch;
    let query = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      })
      .join("&");

    return query;
  };

  const fetchCategories = async (query) => {
    dispatch(removeCategoriesError());
    dispatch(ON_LOADING(true));

    await getCategories(query).then((data) => {
      dispatch(ON_LOADING(false));
      data && dispatch(setCategories(data));
    });
  };

  const searchRequest = async (state) => {
    // console.log("globalSearch" + globalSearch);
    dispatch(setCurrentPage(1));
    const query = handleParams(1, state);
    dispatch(removeCategoriesError());
    dispatch(ON_LOADING(true));
    await getCategories(query).then((data) => {
      dispatch(ON_LOADING(false));
      data && dispatch(setCategories(data));
    });
  };

  const handlePaginationChange = (page) => {
    fetchCategories(handleParams(page));
  };

  const deleteConfirmAll = (value) => {
    const text = '{"cell":{"row":{"values":{"name":"Delete All"}}}}';
    const obj = JSON.parse(text);
    //console.log('obj', obj);
    if (value == "deleted") {
      setDeleteRow(obj);
      dispatch(setDeleteAll(true));
      dispatch(setactiveModal(true));
    }
  };

  const deleteConfirm = async (row) => {
    setDeleteRow(row);
    dispatch(setactiveModal(true));
  };

  const deleteRecord = async () => {
    if (deleteAll == true) {
      dispatch(removeCategoriesError());
      await deleteCategories(selectedCategories).then((data) => {
        if (data.resp) {
          dispatch(setactiveModal(false));
          dispatch(setdeleteConfrim(false));
          fetchCategories(handleParams());
        } else {
          toast.error(data.error);
        }
      });
    } else {
      dispatch(removeCategoriesError());
      //console.log(deleteRow);
      await deleteCategories(deleteRow?.cell?.value).then((data) => {
        if (data.resp) {
          dispatch(setactiveModal(false));
          dispatch(setdeleteConfrim(false));
          fetchCategories(handleParams());
        } else {
          toast.error(data.error);
        }
      });
    }
  };

  const editRecord = async (row) => {
    // await getCategoryList().then((categorylist) => {
    //   dispatch(ON_LOADING(false));
    //   setCategoryList(categorylist);
    // });
    await getCategory(row.slug).then((data) => {
      dispatch(ON_LOADING(false));
      setIsEditModal(true);
      console.log(data);
      setEditRow((prev) => ({
        name: data?.name,
        description: data?.description,
        parent_id: data?.parent_id,
        status: data?.status,
        id: data?.id,
      }));
    });
  };

  const updateCategoryDetails = async () => {
    dispatch(ON_LOADING(true));
    dispatch(setdeleteConfrim(true));
    //console.log(editRow);
    await updateCategories(editRow).then((data) => {
      //console.log(data);
      dispatch(ON_LOADING(false));
      dispatch(setdeleteConfrim(false));
      if (data.resp) {
        fetchCategories(handleParams());
        setIsEditModal(false);
        resetCategory();
      } else {
        toast.error(data.error);
      }
    });
  };

  const addCategory = async () => {
    delete editRow.id;
    dispatch(ON_LOADING(true));

    dispatch(setdeleteConfrim(true));
    await addCategories(editRow).then((data) => {
      dispatch(ON_LOADING(false));

      dispatch(setdeleteConfrim(false));
      if (data.resp) {
        fetchCategories(handleParams());
        setIsEditModal(false);
        resetCategory();
      } else {
        toast.error(data.error);
      }
    });
  };

  const resetCategory = async () => {
    // await getCategoryList().then((categorylist) => {
    //   dispatch(ON_LOADING(false));
    //   setCategoryList(categorylist);
    // });
    setEditRow({
      name: "",
      description: "",
      parent_id: 0,
      status: "",
      id: "",
    });
  };

  const columns = useMemo(() => COLUMNS, []);

  return (
    <>
      <Confirmation
        title="Confirm"
        label="Confirm"
        labelClass="btn-outline-dark"
        className="max-w-md"
        centered
        footerContent={
          <Button
            text={"Delete"}
            isLoading={deleteConfrim}
            className="btn-danger "
            onClick={() => {
              dispatch(setdeleteConfrim(true));
              deleteRecord();
            }}
          />
        }
      >
        <h4 className="font-medium text-[16px] text-center text-slate-900">
          ({deleteRow?.cell?.row?.values?.name})
        </h4>
        <h4 className="font-medium text-[12px] text-center text-slate-900">
          Are you sure you want delete..?
        </h4>
      </Confirmation>

      {isEditModal && (
        <EditModel
          category={editRow}
          setCategory={setEditRow}
          isEditModal={isEditModal}
          setIsEditModal={setIsEditModal}
          updateCategoryDetails={updateCategoryDetails}
          modalName={modalName}
          addCategory={addCategory}
          deleteConfrim={deleteConfrim}
          categoryList={categoryList}
        />
      )}

      {isLoading && <Loader />}
      <Card>
        {categories?.data && (
          <CategoryTable
            title={title}
            columns={columns}
            categoryData={categories}
            handlePaginationChange={handlePaginationChange}
            setModalName={setModalName}
            setIsEditModal={setIsEditModal}
            setEditRow={setEditRow}
            setSelectedCategories={setSelectedCategories}
            deleteConfirmAll={deleteConfirmAll}
            searchRequest={searchRequest}
            resetCategory={resetCategory}
          />
        )}
      </Card>
    </>
  );
};

export default CategoryList;
