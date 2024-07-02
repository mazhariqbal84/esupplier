import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import {
  removeAttributesError,
  setAttributesErrors,
  setAttributes,
  setCurrentPage,
} from "../store/store";
import { ON_LOADING } from "@/store/loader";
import Loader from "@/components/Loader";
import { useSelector, useDispatch } from "react-redux";
import AttributeTable from "@/components/ui/attributes/AttributeTable";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import Confirmation from "@/components/ui/Confirmation";
import Button from "@/components/ui/Button";
import {
  setactiveModal,
  setdeleteConfrim,
  setDeleteAll,
} from "@/store/services/common/confirmation.module";
import EditModel from "@/components/ui/attributes/EditModel";
import {
  addAttributes,
  deleteAttributes,
  getAttributes,
  updateAttributes,
  getAttribute,
  getAttributeList,
} from "@/pages/attribute/store/actions";
import { toast } from "react-toastify";
const AttributeList = ({ title = "Manage Attributes" }) => {
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
      Header: "Display Name",
      accessor: "display_name",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Options Types",
      accessor: "options",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
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
            {/* <Tooltip
              content="Edit"
              placement="top"
              arrow
              animation="shift-away"
            >
              <button
                className="action-btn"
                type="button"
                onClick={(e) =>
                  // editRecord(row?.cell?.row?.original), setModalName("update");
                  console.log("check the values update")
                }
              >
                <Icon icon="heroicons:pencil-square" />
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
  const { attributes } = useSelector((state) => state.attributes);
  const { itemsPerPage } = useSelector((state) => state.attributes);
  const { currentPage } = useSelector((state) => state.attributes);
  const { globalSearch } = useSelector((state) => state.attributes);
  const { deleteConfrim } = useSelector((state) => state.confirmation);
  const { deleteAll } = useSelector((state) => state.confirmation);
  const [deleteRow, setDeleteRow] = useState(null);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [attributeList, setAttributeList] = useState([]);
  const [editRow, setEditRow] = useState({
    name: "",
    display_name: "",
    options: {},
    values: [],
    status: "",
    id: "",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    fetchAttributes(handleParams());
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

  const fetchAttributes = async (query) => {
    dispatch(removeAttributesError());
    dispatch(ON_LOADING(true));

    await getAttributes(query).then((data) => {
      dispatch(ON_LOADING(false));
      data && dispatch(setAttributes(data));
    });
  };

  const searchRequest = async (state) => {
    // console.log("globalSearch" + globalSearch);
    dispatch(setCurrentPage(1));
    const query = handleParams(1, state);
    dispatch(removeAttributesError());
    dispatch(ON_LOADING(true));
    await getAttributes(query).then((data) => {
      dispatch(ON_LOADING(false));
      data && dispatch(setAttributes(data));
    });
  };

  const handlePaginationChange = (page) => {
    fetchAttributes(handleParams(page));
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
      dispatch(removeAttributesError());
      await deleteAttributes(selectedAttributes).then((data) => {
        if (data.resp) {
          dispatch(setactiveModal(false));
          dispatch(setdeleteConfrim(false));
          fetchAttributes(handleParams());
        } else {
          toast.error(data.error);
        }
      });
    } else {
      dispatch(removeAttributesError());
      //console.log(deleteRow);
      await deleteAttributes(deleteRow?.cell?.value).then((data) => {
        if (data.resp) {
          dispatch(setactiveModal(false));
          dispatch(setdeleteConfrim(false));
          fetchAttributes(handleParams());
        } else {
          toast.error(data.error);
        }
      });
    }
  };

  const editRecord = async (row) => {
    // await getAttributeList().then((attributelist) => {
    //   dispatch(ON_LOADING(false));
    //   setAttributeList(attributelist);
    // });
    await getAttribute(row.id).then((data) => {
      dispatch(ON_LOADING(false));
      setIsEditModal(true);
      console.log(data);
      setEditRow((prev) => ({
        name: data?.name,
        display_name: data?.display_name,
        options: data?.options,
        values: data?.attribute_values,
        status: data?.status,
        id: data?.id,
      }));
    });
  };

  const updateAttributeDetails = async () => {
    dispatch(ON_LOADING(true));
    dispatch(setdeleteConfrim(true));
    const addRowValue = {
      name: editRow?.name,
      display_name: editRow?.display_name,
      options: editRow?.options?.value,
      values: editRow?.values,
      status: editRow?.status,
      id: editRow?.id,
    };
    //console.log(editRow);
    await updateAttributes(addRowValue).then((data) => {
      //console.log(data);
      dispatch(ON_LOADING(false));
      dispatch(setdeleteConfrim(false));
      if (data.resp) {
        fetchAttributes(handleParams());
        setIsEditModal(false);
        resetAttribute();
      } else {
        toast.error(data.error);
      }
    });
  };

  const addAttribute = async () => {
    delete editRow.id;
    dispatch(ON_LOADING(true));
    const addRowValue = {
      name: editRow?.name,
      display_name: editRow?.display_name,
      options: editRow?.options?.value,
      values: editRow?.values,
      status: editRow?.status,
    };
    dispatch(setdeleteConfrim(true));
    await addAttributes(addRowValue).then((data) => {
      console.log("get attributes", data);
      dispatch(ON_LOADING(false));

      dispatch(setdeleteConfrim(false));
      if (data.resp) {
        fetchAttributes(handleParams());
        setIsEditModal(false);
        resetAttribute();
      } else {
        toast.error(data.error);
      }
    });
  };

  const resetAttribute = async () => {
    // await getAttributeList().then((attributelist) => {
    //   dispatch(ON_LOADING(false));
    //   setAttributeList(attributelist);
    // });
    setEditRow({
      name: "",
      display_name: "",
      options: {},
      values: [],
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
          attribute={editRow}
          setAttribute={setEditRow}
          isEditModal={isEditModal}
          setIsEditModal={setIsEditModal}
          updateAttributeDetails={updateAttributeDetails}
          modalName={modalName}
          addAttribute={addAttribute}
          deleteConfrim={deleteConfrim}
          attributeList={attributeList}
        />
      )}

      {isLoading && <Loader />}
      <Card>
        {attributes?.data && (
          <AttributeTable
            title={title}
            columns={columns}
            attributeData={attributes}
            handlePaginationChange={handlePaginationChange}
            setModalName={setModalName}
            setIsEditModal={setIsEditModal}
            setEditRow={setEditRow}
            setSelectedAttributes={setSelectedAttributes}
            deleteConfirmAll={deleteConfirmAll}
            searchRequest={searchRequest}
            resetAttribute={resetAttribute}
          />
        )}
      </Card>
    </>
  );
};

export default AttributeList;
