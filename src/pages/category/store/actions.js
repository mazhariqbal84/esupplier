import { toast } from "react-toastify";
import ApiService from "../../../store/services/api.service";

export const getCategories = (payload) => {

  ApiService.setHeader();
  const data = ApiService.get("api/categories/get-categories")
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
export const getCategory = (slug) => {
  ApiService.setHeader();
  const data = ApiService.get("api/categories/get-category-details/" + slug)
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
export const getAllCategories = () => {
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
export const getCategoryList = () => {
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

export const addCategories = (row) => {
  ApiService.setHeader();
  const data = ApiService.post(`api/categories/store-category`, row)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Category added successfully.");
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

export const deleteCategories = (id) => {
  ApiService.setHeader();
  const data = ApiService.get(`api/categories/delete/${id}`)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Category deleted successfully.");
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

export const updateCategories = (row) => {
  ApiService.setHeader();
  const data = ApiService.post(`api/categories/update-category`, row)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Category updated successfully.");
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
