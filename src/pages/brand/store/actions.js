import { toast } from "react-toastify";
import ApiService from "../../../store/services/api.service";

export const getBrands = (payload) => {

  ApiService.setHeader();
  const data = ApiService.get("api/brands/get-brands")
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
export const getBrand = (slug) => {
  ApiService.setHeader();
  const data = ApiService.get("api/brands/get-brand-details/" + slug)
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
export const getAllBrands = () => {
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
export const getBrandList = () => {
  ApiService.setHeader();
  const data = ApiService.get("api/get-vendor-categories-list")
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

export const addBrands = (row) => {
  ApiService.setHeader();
  const data = ApiService.post(`api/brands/store-brand`, row)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Brand added successfully.");
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

export const deleteBrands = (id) => {
  ApiService.setHeader();
  const data = ApiService.get(`api/brands/delete/${id}`)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Brand deleted successfully.");
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

export const updateBrands = (row) => {
  ApiService.setHeader();
  const data = ApiService.post(`api/brands/update-brand`, row)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Brand updated successfully.");
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
