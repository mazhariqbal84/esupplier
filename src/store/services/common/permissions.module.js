import ApiService from "@/core/services/api.service";
import { SET_SNACK } from "@/core/services/store/snackbar.module";

// action types
export const PERMISSIONS_LIST = "permissions_list";
export const PERMISSIONS_SIMPLE_LIST = "permissions_simple_list";
export const PERMISSIONS_ADMIN_LIST = "permissions_admin_list";
export const PERMISSIONS_VENDOR_LIST = "permissions_vendor_list";
export const CREATE_PERMISSION = "create_permission";
export const UPDATE_PERMISSION = "update_permission";
export const DELETE_PERMISSION = "delete_permission";
export const CLEAR_ERRORS = "clearErrors";

// mutation types
export const SET_ERROR = "setError";
export const REMOVE_ERRORS = "removeErrors";

const state = {
  errors: null
};

const actions = {
  [PERMISSIONS_SIMPLE_LIST](context, payload) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get(
        "api/permissionssimplelist"
      )
        .then(({ data }) => { if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
          window.open("/package-expire", "_self");
        }
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.errors);
        });
    });
  },
  [PERMISSIONS_LIST](context, payload) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.datatable(
        "api/permissions?" + payload.q + payload.columns.join("")
      )
        .then(({ data }) => {
           if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          }
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.errors);
        });
    });
  },
  [PERMISSIONS_ADMIN_LIST]() {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/adminpermissions").then(({ data }) => {
        if (data._metadata.outcomeCode === 0) {
          resolve(data);
        }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
          window.open("/package-expire", "_self");
        } else {
          this.dispatch(SET_SNACK, {
            clr: "error",
            msg: data._metadata.message
          });
        }
      });
    });
  },
  [PERMISSIONS_VENDOR_LIST]() {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/vendorpermissions").then(({ data }) => {
        if (data._metadata.outcomeCode === 0) {
          resolve(data);
        }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
          window.open("/package-expire", "_self");
        } else {
          this.dispatch(SET_SNACK, {
            clr: "error",
            msg: data._metadata.message
          });
        }
      });
    });
  },
  [CREATE_PERMISSION](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/createpermission", payload.data)
        .then(({ data }) => {
          if (data._metadata.outcomeCode === 0) {
            this.dispatch(SET_SNACK, {
              clr: "success",
              msg: data._metadata.message
            });
            resolve(data);
          }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          } else {
            this.dispatch(SET_SNACK, {
              clr: "error",
              msg: data._metadata.message
            });
            context.commit(SET_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.errors);
        });
    });
  },
  [UPDATE_PERMISSION](context, payload) {
    return new Promise(resolve => {
      return ApiService.update(
        "api/updatepermission",
        payload.slug,
        payload.data
      )
        .then(({ data }) => {
          if (data._metadata.outcomeCode === 0) {
            this.dispatch(SET_SNACK, {
              clr: "success",
              msg: data._metadata.message
            });
            resolve(data);
          }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          } else {
            this.dispatch(SET_SNACK, {
              clr: "error",
              msg: data._metadata.message
            });
            context.commit(SET_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.errors);
        });
    });
  },
  [DELETE_PERMISSION](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/deletepermission", payload)
        .then(({ data }) => {
          if (data._metadata.outcomeCode === 0) {
            this.dispatch(SET_SNACK, {
              clr: "success",
              msg: data._metadata.message
            });
            resolve(data);
          }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          } else {
            this.dispatch(SET_SNACK, {
              clr: "error",
              msg: data._metadata.message
            });
            context.commit(SET_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.errors);
        });
    });
  },
  [CLEAR_ERRORS](context) {
    context.commit(REMOVE_ERRORS);
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [REMOVE_ERRORS](state) {
    state.errors = {};
  }
};

export default {
  state,
  actions,
  mutations
};
