import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import {
  removeBrandsError,
  setBrandsErrors,
  setBrands,
  setCurrentPage,
} from "../store/store";
import { ON_LOADING } from "@/store/loader";
import Loader from "@/components/Loader";
import { useSelector, useDispatch } from "react-redux";
import BrandTable from "@/components/ui/brands/BrandTable";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import Confirmation from "@/components/ui/Confirmation";
import image1 from "@/assets/images/dummy.png";
import Button from "@/components/ui/Button";
import {
  setactiveModal,
  setdeleteConfrim,
  setDeleteAll,
} from "@/store/services/common/confirmation.module";
import EditModel from "@/components/ui/brands/EditModel";
import {
  addBrands,
  deleteBrands,
  getBrands,
  updateBrands,
  getBrand,
  getBrandList,
} from "@/pages/brand/store/actions";
import { toast } from "react-toastify";
const BrandList = ({ title = "Manage Brands" }) => {
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
      Header: "Logo",
      accessor: "image_url",
      Cell: (row) => {
        return (
          <div className="md:h-16 h-12 md:w-16 w-12 rounded-full">
            <img
              src={row?.cell?.value ?? image1}
              alt=""
              className="block w-full h-full object-cover rounded-full"
            />
          </div>
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
  const { brands } = useSelector((state) => state.brands);
  const { itemsPerPage } = useSelector((state) => state.brands);
  const { currentPage } = useSelector((state) => state.brands);
  const { globalSearch } = useSelector((state) => state.brands);
  const { deleteConfrim } = useSelector((state) => state.confirmation);
  const { deleteAll } = useSelector((state) => state.confirmation);
  const [deleteRow, setDeleteRow] = useState(null);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [editRow, setEditRow] = useState({
    name: "",
    description: "",
    image: null,
    status: "",
    id: "",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    fetchBrands(handleParams());
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

  const fetchBrands = async (query) => {
    dispatch(removeBrandsError());
    dispatch(ON_LOADING(true));

    await getBrands(query).then((data) => {
      dispatch(ON_LOADING(false));
      data && dispatch(setBrands(data));
    });
  };

  const searchRequest = async (state) => {
    // console.log("globalSearch" + globalSearch);
    dispatch(setCurrentPage(1));
    const query = handleParams(1, state);
    dispatch(removeBrandsError());
    dispatch(ON_LOADING(true));
    await getBrands(query).then((data) => {
      dispatch(ON_LOADING(false));
      data && dispatch(setBrands(data));
    });
  };

  const handlePaginationChange = (page) => {
    fetchBrands(handleParams(page));
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
      dispatch(removeBrandsError());
      await deleteBrands(selectedBrands).then((data) => {
        if (data.resp) {
          dispatch(setactiveModal(false));
          dispatch(setdeleteConfrim(false));
          fetchBrands(handleParams());
        } else {
          toast.error(data.error);
        }
      });
    } else {
      dispatch(removeBrandsError());
      //console.log(deleteRow);
      await deleteBrands(deleteRow?.cell?.value).then((data) => {
        if (data.resp) {
          dispatch(setactiveModal(false));
          dispatch(setdeleteConfrim(false));
          fetchBrands(handleParams());
        } else {
          toast.error(data.error);
        }
      });
    }
  };

  const editRecord = async (row) => {
    // await getBrandList().then((brandlist) => {
    //   dispatch(ON_LOADING(false));
    //   setBrandList(brandlist);
    // });
    await getBrand(row.id).then((data) => {
      dispatch(ON_LOADING(false));
      setIsEditModal(true);
      console.log(data);
      setEditRow((prev) => ({
        name: data?.name,
        description: data?.description,
        image: data?.image_url,
        status: data?.status,
        id: data?.id,
      }));
    });
  };

  const updateBrandDetails = async () => {
    dispatch(ON_LOADING(true));
    dispatch(setdeleteConfrim(true));
    const formData = new FormData();
    formData.append("name", editRow?.name);
    formData.append("description", editRow?.description);
    formData.append("image", editRow?.image);
    formData.append("status", editRow?.status);
    // formData.append("categories", "1,2");
    formData.append("id", editRow?.id);
    //console.log(editRow);
    await updateBrands(formData).then((data) => {
      //console.log(data);
      dispatch(ON_LOADING(false));
      dispatch(setdeleteConfrim(false));
      if (data.resp) {
        fetchBrands(handleParams());
        setIsEditModal(false);
        resetBrand();
      } else {
        toast.error(data.error);
      }
    });
  };

  const addBrand = async () => {
    delete editRow.id;
    dispatch(ON_LOADING(true));

    dispatch(setdeleteConfrim(true));
    const formData = new FormData();
    formData.append("name", editRow?.name);
    formData.append("description", editRow?.description);
    formData.append("image", editRow?.image);
    formData.append("status", editRow?.status);
    // formData.append("category_id", "1,2");
    await addBrands(formData).then((data) => {
      console.log("get brands", data);
      dispatch(ON_LOADING(false));

      dispatch(setdeleteConfrim(false));
      if (data.resp) {
        fetchBrands(handleParams());
        setIsEditModal(false);
        resetBrand();
      } else {
        toast.error(data.error);
      }
    });
  };

  const resetBrand = async () => {
    // await getBrandList().then((brandlist) => {
    //   dispatch(ON_LOADING(false));
    //   setBrandList(brandlist);
    // });
    setEditRow({
      name: "",
      description: "",
      image: null,
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
          brand={editRow}
          setBrand={setEditRow}
          isEditModal={isEditModal}
          setIsEditModal={setIsEditModal}
          updateBrandDetails={updateBrandDetails}
          modalName={modalName}
          addBrand={addBrand}
          deleteConfrim={deleteConfrim}
          brandList={brandList}
        />
      )}

      {isLoading && <Loader />}
      <Card>
        {brands?.data && (
          <BrandTable
            title={title}
            columns={columns}
            brandData={brands}
            handlePaginationChange={handlePaginationChange}
            setModalName={setModalName}
            setIsEditModal={setIsEditModal}
            setEditRow={setEditRow}
            setSelectedBrands={setSelectedBrands}
            deleteConfirmAll={deleteConfirmAll}
            searchRequest={searchRequest}
            resetBrand={resetBrand}
          />
        )}
      </Card>
    </>
  );
};

export default BrandList;
