import ApiService from "@/core/services/api.service";
import { SET_SNACK } from "@/core/services/store/snackbar.module";
import {SET_FLASH_DEALS_ERROR} from "@/core/services/store/flash_deals.module";
import {UPDATE_BANNERS_STATUS} from "@/core/services/store/banners.module";

// action types
export const USERS_LIST = "users_list";
export const CREATE_USER = "create_user";
export const UPDATE_USER = "update_user";
export const UPDATE_USER_COUNTRY = "update_user_country";
export const DELETE_USER = "delete_user";
export const GET_USER_DETAILS = "get_user_details";
export const GET_USER_ROLES = "get_user_roles";
export const GET_USER_ROLES_EXCEPT = "get_user_roles_except";
export const ASSIGN_ROLES_TO_USER = "assign_roles_to_user";
export const REMOVE_ROLE_FROM_USER = "remove_role_from_user";
export const UPDATE_STATUS = "update_status";
export const UPDATE_PASSWORD = "update_user_password";
export const CLEAR_USER_ERRORS = "clearUserErrors";

// mutation types
export const SET_USER_ERROR = "setUserError";
export const REMOVE_USER_ERRORS = "removeUserErrors";

const state = {
  errors: null,
  uploadedUserDetails: {},
  uploadedUserBankDetails: [],
  uploadedUserCardDetails: [],
  uploadedUserComments: []
};

const actions = {
  [UPDATE_PASSWORD](context, payload) {
    return new Promise(resolve => {
      return ApiService.update("api/updateuserpassword", payload.slug, payload.data).then(({data}) => {
        if (data._metadata.outcomeCode === 0) {
          this.dispatch(SET_SNACK, {clr: 'success', msg: data._metadata.message});
          resolve(data);
        }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
          window.open("/package-expire", "_self");
        } else {
          this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
          context.commit(SET_USER_ERROR, data.errors);
        }
      })
          .catch(({response}) => {
            context.commit(SET_USER_ERROR, response.errors);
          });
    });
  },
  [UPDATE_STATUS](context, payload) {
    return new Promise(resolve => {
      return ApiService.update("api/updatestatus", payload.slug, payload.data).then(({data}) => {
        if (data._metadata.outcomeCode === 0) {
          this.dispatch(SET_SNACK, {clr: 'success', msg: data._metadata.message});
          resolve(data);
        }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
          window.open("/package-expire", "_self");
        } else {
          this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
          context.commit(SET_USER_ERROR, data.errors);
        }
      })
          .catch(({response}) => {
            context.commit(SET_USER_ERROR, response.errors);
          });
    });
  },
  [USERS_LIST](context, payload) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.datatable("api/users?" + payload.q + payload.columns.join(""))
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_USER_ERROR, response.errors);
        });
    });
  },
  [GET_USER_DETAILS](context, id) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/getuserdetail", id)
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
            context.commit(SET_USER_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_USER_ERROR, response.errors);
        });
    });
  },
  [CREATE_USER](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/createuser", payload.data)
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
            context.commit(SET_USER_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_USER_ERROR, response.errors);
        });
    });
  },
  [UPDATE_USER](context, payload) {
    return new Promise(resolve => {
      return ApiService.update("api/updateuser", payload.slug, payload.data)
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
            context.commit(SET_USER_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_USER_ERROR, response.errors);
        });
    });
  },
  [UPDATE_USER_COUNTRY](context, payload) {
    return new Promise(resolve => {
      return ApiService.update(
        "api/updateusercountry",
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
            context.commit(SET_USER_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_USER_ERROR, response.errors);
        });
    });
  },
  [DELETE_USER](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/deleteuser", payload)
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
            context.commit(SET_USER_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_USER_ERROR, response.errors);
        });
    });
  },
  [GET_USER_ROLES](context, payload) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get(
        "api/getuserroles",payload
      )
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_USER_ERROR, response.errors);
        });
    });
  },
  [GET_USER_ROLES_EXCEPT](context, payload) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/getuserrolesexcept", payload)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_USER_ERROR, response.errors);
        });
    });
  },
  [ASSIGN_ROLES_TO_USER](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/assignrolestouser", payload.data)
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
            context.commit(SET_USER_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_USER_ERROR, response.errors);
        });
    });
  },
  [REMOVE_ROLE_FROM_USER](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/removerolefromuser", payload.data)
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
            context.commit(SET_USER_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_USER_ERROR, response.errors);
        });
    });
  },
  [CLEAR_USER_ERRORS](context) {
    context.commit(REMOVE_USER_ERRORS);
  }
};

const mutations = {
  [SET_USER_ERROR](state, error) {
    state.errors = error;
  },
  [REMOVE_USER_ERRORS](state) {
    state.errors = {};
  }
};

export default {
  state,
  actions,
  mutations
};
