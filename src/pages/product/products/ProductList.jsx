import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import {
  removeProductsError,
  setProductsErrors,
  setProducts,
  setCurrentPage,
} from "../store/store";
import { ON_LOADING } from "@/store/loader";
import Loader from "@/components/Loader";
import { useSelector, useDispatch } from "react-redux";
import ProductTable from "@/components/ui/products/ProductTable";
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
import EditModel from "@/components/ui/products/EditModel";
import {
  addProducts,
  deleteProducts,
  getProducts,
  updateProducts,
  getProduct,
  getProductList,
} from "@/pages/product/store/actions";
import { toast } from "react-toastify";
const ProductList = ({ title = "Manage Products" }) => {
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
      Header: "category",
      accessor: "category",
      Cell: (row) => {
        return <span>{row?.cell?.value?.name}</span>;
      },
    },
    {
      Header: "brand",
      accessor: "brand",
      Cell: (row) => {
        return <span>{row?.cell?.value?.name}</span>;
      },
    },
    {
      Header: "quantity",
      accessor: "quantity",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "sale_price",
      accessor: "sale_price",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "price",
      accessor: "price",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },

    {
      Header: "Logo",
      accessor: "image",
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
  const { products } = useSelector((state) => state.products);
  const { itemsPerPage } = useSelector((state) => state.products);
  const { currentPage } = useSelector((state) => state.products);
  const { globalSearch } = useSelector((state) => state.products);
  const { deleteConfrim } = useSelector((state) => state.confirmation);
  const { deleteAll } = useSelector((state) => state.confirmation);
  const [deleteRow, setDeleteRow] = useState(null);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [editRow, setEditRow] = useState({
    name: "",
    description: "",
    image: "",
    status: "",
    id: "",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    fetchProducts(handleParams());
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

  const fetchProducts = async (query) => {
    dispatch(removeProductsError());
    dispatch(ON_LOADING(true));

    await getProducts(query).then((data) => {
      dispatch(ON_LOADING(false));
      data && dispatch(setProducts(data));
    });
  };

  const searchRequest = async (state) => {
    // console.log("globalSearch" + globalSearch);
    dispatch(setCurrentPage(1));
    const query = handleParams(1, state);
    dispatch(removeProductsError());
    dispatch(ON_LOADING(true));
    await getProducts(query).then((data) => {
      dispatch(ON_LOADING(false));
      data && dispatch(setProducts(data));
    });
  };

  const handlePaginationChange = (page) => {
    fetchProducts(handleParams(page));
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
      dispatch(removeProductsError());
      await deleteProducts(selectedProducts).then((data) => {
        if (data.resp) {
          dispatch(setactiveModal(false));
          dispatch(setdeleteConfrim(false));
          fetchProducts(handleParams());
        } else {
          toast.error(data.error);
        }
      });
    } else {
      dispatch(removeProductsError());
      //console.log(deleteRow);
      await deleteProducts(deleteRow?.cell?.value).then((data) => {
        if (data.resp) {
          dispatch(setactiveModal(false));
          dispatch(setdeleteConfrim(false));
          fetchProducts(handleParams());
        } else {
          toast.error(data.error);
        }
      });
    }
  };

  const editRecord = async (row) => {
    // await getProductList().then((productlist) => {
    //   dispatch(ON_LOADING(false));
    //   setProductList(productlist);
    // });
    await getProduct(row.slug).then((data) => {
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

  const updateProductDetails = async () => {
    dispatch(ON_LOADING(true));
    dispatch(setdeleteConfrim(true));
    //console.log(editRow);
    await updateProducts(editRow).then((data) => {
      //console.log(data);
      dispatch(ON_LOADING(false));
      dispatch(setdeleteConfrim(false));
      if (data.resp) {
        fetchProducts(handleParams());
        setIsEditModal(false);
        resetProduct();
      } else {
        toast.error(data.error);
      }
    });
  };

  const addProduct = async () => {
    delete editRow.id;
    dispatch(ON_LOADING(true));

    dispatch(setdeleteConfrim(true));
    await addProducts(editRow).then((data) => {
      dispatch(ON_LOADING(false));

      dispatch(setdeleteConfrim(false));
      if (data.resp) {
        fetchProducts(handleParams());
        setIsEditModal(false);
        resetProduct();
      } else {
        toast.error(data.error);
      }
    });
  };

  const resetProduct = async () => {
    // await getProductList().then((productlist) => {
    //   dispatch(ON_LOADING(false));
    //   setProductList(productlist);
    // });
    setEditRow({
      name: "",
      description: "",
      image: 0,
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
          product={editRow}
          setProduct={setEditRow}
          isEditModal={isEditModal}
          setIsEditModal={setIsEditModal}
          updateProductDetails={updateProductDetails}
          modalName={modalName}
          addProduct={addProduct}
          deleteConfrim={deleteConfrim}
          productList={productList}
        />
      )}

      {isLoading && <Loader />}
      <Card>
        {products?.data && (
          <ProductTable
            title={title}
            columns={columns}
            productData={products}
            handlePaginationChange={handlePaginationChange}
            setModalName={setModalName}
            setIsEditModal={setIsEditModal}
            setEditRow={setEditRow}
            setSelectedProducts={setSelectedProducts}
            deleteConfirmAll={deleteConfirmAll}
            searchRequest={searchRequest}
            resetProduct={resetProduct}
          />
        )}
      </Card>
    </>
  );
};

export default ProductList;
