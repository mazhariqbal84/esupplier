import { toast } from "react-toastify";
import ApiService from "../../../store/services/api.service";

export const getProducts = (payload) => {

  ApiService.setHeader();
  const data = ApiService.get("api/products/get-products")
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
export const getProduct = (slug) => {
  ApiService.setHeader();
  const data = ApiService.get("api/categories/get-product-details/" + slug)
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
export const getAllProducts = () => {
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
export const getProductList = () => {
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

export const addProducts = (row) => {
  ApiService.setHeader();
  const data = ApiService.post(`api/categories/store-product`, row)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Product added successfully.");
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

export const deleteProducts = (id) => {
  ApiService.setHeader();
  const data = ApiService.get(`api/categories/delete/${id}`)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Product deleted successfully.");
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

export const updateProducts = (row) => {
  ApiService.setHeader();
  const data = ApiService.post(`api/categories/update-product`, row)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Product updated successfully.");
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
