import { toast } from "react-toastify";
import ApiService from "../../../store/services/api.service";

export const getAttributes = (payload) => {

  ApiService.setHeader();
  const data = ApiService.get("api/attributes/get-attributes")
    .then(function (result) {
      if (result.data._metadata.outcomeCode === 200) {
        return result.data.records;
      } else {
        return null;
      }
    })
    .catch(function (error) {
      console.log("Error: ", error);
      return error;
    });

  return data;
};
export const getAttribute = (slug) => {
  ApiService.setHeader();
  const data = ApiService.get("api/attributes/get-attributes-details/" + slug)
    .then(function (result) {
      if (result.data._metadata.outcomeCode === 200) {
        return result.data.records;
      } else {
        return null;
      }
    })
    .catch(function (error) {
      console.log("Error: ", error);
      return error;
    });

  return data;
};
export const getAllAttributes = () => {
  ApiService.setHeader();
  const data = ApiService.get("api/categories/get-parent-categories")
    .then(function (result) {
      if (result.data._metadata.outcomeCode === 200) {
        return result.data.records;
      } else {
        return null;
      }
    })
    .catch(function (error) {
      console.log("Error: ", error);
      return error;
    });

  return data;
};
export const getAttributeList = () => {
  ApiService.setHeader();
  const data = ApiService.get("api/get-vendor-categories-list")
    .then(function (result) {
      if (result.data._metadata.outcomeCode === 200) {
        return result.data.records;
      } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
        window.open("/package-expire", "_self");
      } else {
        return null;
      }
    })
    .catch(function (error) {
      console.log("Error: ", error);
      return error;
    });

  return data;
};

export const addAttributes = (row) => {
  ApiService.setHeader();
  const data = ApiService.post(`api/attributes/store-attributes`, row)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Attribute added successfully.");
        return { resp: true, data: result.data.records };
      } else {
        return { resp: false, error: result.data.errors[0] };
      }
    })
    .catch(function (error) {
      console.log("Error: ", error);
      return error;
    });

  return data;
};

export const deleteAttributes = (id) => {
  ApiService.setHeader();
  const data = ApiService.get(`api/attributes/delete/${id}`)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Attribute deleted successfully.");
        return { resp: true, data: result.data.records };
      } else {
        return { resp: false, error: result.data.errors[0] };
      }
    })
    .catch(function (error) {
      console.log("Error: ", error);
      return error;
    });

  return data;
};

export const updateAttributes = (row) => {
  ApiService.setHeader();
  const data = ApiService.post(`api/attributes/update-attributes`, row)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Attribute updated successfully.");
        return { resp: true, data: result.data.records };
      } else {
        return { resp: false, error: result.data.errors[0] };
      }
    })
    .catch(function (error) {
      console.log("Error: ", error);
      return error;
    });

  return data;
};
