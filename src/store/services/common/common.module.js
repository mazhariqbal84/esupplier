import ApiService from "@/core/services/api.service";
import { SET_SNACK } from "@/core/services/store/snackbar.module";
import {SET_BRANDS_ERROR} from "@/core/services/store/brands.module";

// action types
export const DELETE_MODULES = "delete_modules";
export const CLEAR_COMMON_ERRORS = "clearCommonErrors";

// mutation types
export const SET_COMMON_ERROR = "setCommonError";
export const REMOVE_COMMON_ERRORS = "removeCommonErrors";
export const GET_COUNTRIES_LIST = "get_countries_list";
export const GET_COURIER_COMPANY_LIST = "get_courier_company_list";
export const SELLERS_SIMPLE_LIST = "seller_simple_list";
export const DEALS_SIMPLE_LIST = "deals_simple_list";
export const BRANDS_SIMPLE_LIST = "brand_simple_list";
export const GET_SELLER_PRODUCTS = "get_seller_produts";
export const GET_VENDOR_PRODUCTS = "get_vendor_produts";



const state = {
  errors: null
};
const actions = {
  [GET_COURIER_COMPANY_LIST]() {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/couriercompanysimplelist").then(({ data }) => {
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
  [BRANDS_SIMPLE_LIST]() {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/brandsimplelist").then(({ data }) => {
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
  [DEALS_SIMPLE_LIST]() {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/dealsimplelist").then(({ data }) => {
        if (data._metadata.outcomeCode === 0) {
          resolve(data);
        } else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
          window.open("/package-expire", "_self");
        }else {
          this.dispatch(SET_SNACK, {
            clr: "error",
            msg: data._metadata.message
          });
        }
      });
    });
  },
  [SELLERS_SIMPLE_LIST]() {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/sellersimplelist").then(({ data }) => {
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
  [GET_SELLER_PRODUCTS](context,id) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/getsellerproductlist",id).then(({ data }) => {
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
  [GET_VENDOR_PRODUCTS](context,id) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/getvendorproductlist").then(({ data }) => {
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
  [GET_COUNTRIES_LIST](context) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.datatable("api/countriessimplelist")
          .then(({ data }) => {
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
          })
          .catch(({ response }) => {
            context.commit(SET_BRANDS_ERROR, response.errors);
          });
    });
  },
  [DELETE_MODULES](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/deletemodules", payload)
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
            context.commit(SET_COMMON_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_COMMON_ERROR, response.errors);
        });
    });
  },
  [CLEAR_COMMON_ERRORS](context) {
    context.commit(REMOVE_COMMON_ERRORS);
  },
};

const mutations = {
  [SET_COMMON_ERROR](state, error) {
    state.errors = error;
  },
  [REMOVE_COMMON_ERRORS](state) {
    state.errors = {};
  }
};

export default {
  state,
  actions,
  mutations
};
