import { toast } from "react-toastify";
import ApiService from "../../../store/services/api.service";

export const getInvoices = (payload) => {
  ApiService.setHeader();
  const data = ApiService.get("api/get-invoices?" + payload)
    .then(function (result) {
      if (result?.data?._metadata?.outcomeCode === 200) {
        return result?.data?.records;
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
export const getInvoiceDetail = (uuid) => {
  ApiService.setHeader();
  const data = ApiService.get(
    "api/internal-invoices/get-single-invoice/" + uuid
  )
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
export const getTransactionDetails = (uuid) => {
  ApiService.setHeader();
  const data = ApiService.get("api/detail-transection/" + uuid)
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
export const getSubscriptionDate = (payload, params) => {
  // console.log(payload, params.id);
  ApiService.setHeader();
  const data = ApiService.get(
    "api/recursion-dates/" + params + "?page=" + payload
  )
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
export const sendTransactionLink = (uuid) => {
  ApiService.setHeader();
  const data = ApiService.get("api/send-email-transaction-link/" + uuid)
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
export const getPermissionList = () => {
  ApiService.setHeader();
  const data = ApiService.get("api/get-vendor-permissions-list")
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

export const addInvoices = (row) => {
  ApiService.setHeader();
  const data = ApiService.post(`api/create-user`, row)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Invoice added successfully.");
        return { resp: true, data: result.data.records };
      } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
        window.open("/package-expire", "_self");
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

export const deleteInvoices = (id) => {
  ApiService.setHeader();
  const data = ApiService.delete(
    "api/internal-invoices/delete-selected-invoices",
    `uuids=${id}`
  )
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Invoice deleted successfully.");
        return { resp: true, data: result.data.records };
      } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
        window.open("/package-expire", "_self");
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

export const updateInvoices = (row) => {
  ApiService.setHeader();
  const data = ApiService.post(`api/update-user/${row.uuid}`, row)
    .then(function (result) {
      if (result.data._metadata.outcome === "SUCCESS") {
        toast.success("Invoice updated successfully.");
        return { resp: true, data: result.data.records };
      } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
        window.open("/package-expire", "_self");
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
export const sendinvoicepdfonemail = (uuid) => {
  ApiService.setHeader();
  const data = ApiService.get("api/generate-invoice-pdf/" + uuid)
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
export const subscriptionDateClose = (uuid) => {
  ApiService.setHeader();
  const data = ApiService.get("api/invoice-closed/" + uuid)
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
export const invoicedownloadrequest = (uuid) => {
  ApiService.setHeader();
  const data = ApiService.get("api/generate-invoice-pdf-download/" + uuid)
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
export const getTransctionList = (uuid) => {
  ApiService.setHeader();
  const data = ApiService.get("api/internal-invoices/transactions/" + uuid)
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
