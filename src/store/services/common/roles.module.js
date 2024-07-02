import ApiService from "@/core/services/api.service";
import { SET_SNACK } from "@/core/services/store/snackbar.module";

// action types
export const ROLES_LIST = "roles_list";
export const ROLES_SIMPLE_LIST = "roles_simple_list";
export const CREATE_ROLE = "create_role";
export const UPDATE_ROLE = "update_role";
export const DELETE_ROLE = "delete_role";
export const GET_ROLE_DETAILS = "get_role_details";
export const GET_ROLE_PERMISSIONS = "get_role_permissions";
export const GET_ROLE_PERMISSIONS_EXCEPT = "get_role_permissions_except";
export const ASSIGN_PERMISSIONS_TO_ROLE = "assign_permissions_to_role";
export const REMOVE_PERMISSION_FROM_ROLE = "remove_permission_from_role";
export const CLEAR_ROLE_ERRORS = "clearRoleErrors";

// mutation types
export const SET_ROLE_ERROR = "setRoleError";
export const REMOVE_ROLE_ERRORS = "removeRoleErrors";

const state = {
  errors: null
};

const actions = {
  [ROLES_LIST](context, payload) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.datatable("api/roles?" + payload.q + payload.columns.join(""))
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
            context.commit(SET_ROLE_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ROLE_ERROR, response.errors);
        });
    });
  },
  [ROLES_SIMPLE_LIST]() {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/rolessimple").then(({ data }) => {
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
  [CREATE_ROLE](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/createrole", payload.data)
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
            context.commit(SET_ROLE_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ROLE_ERROR, response.errors);
        });
    });
  },
  [UPDATE_ROLE](context, payload) {
    // const { name, display_name, description } = payload;
    // const role = { name, display_name, description };
    return new Promise(resolve => {
      return ApiService.update("api/updaterole", payload.slug, payload.data)
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
            context.commit(SET_ROLE_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ROLE_ERROR, response.errors);
        });
    });
  },
  [DELETE_ROLE](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/deleterole", payload)
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
            context.commit(SET_ROLE_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ROLE_ERROR, response.errors);
        });
    });
  },
  [GET_ROLE_DETAILS](context, id) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/getroledetail", id)
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
            context.commit(SET_ROLE_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ROLE_ERROR, response.errors);
        });
    });
  },
  [GET_ROLE_PERMISSIONS](context, payload) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.datatable(
        "api/getrolepermissions/" +
          payload.slug +
          "?" +
          payload.q +
          payload.columns.join("")
      )
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ROLE_ERROR, response.errors);
        });
    });
  },
  [GET_ROLE_PERMISSIONS_EXCEPT](context, payload) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/getrolepermissionsexcept", payload)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ROLE_ERROR, response.errors);
        });
    });
  },
  [ASSIGN_PERMISSIONS_TO_ROLE](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/assignpermissionstorole", payload)
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
            context.commit(SET_ROLE_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ROLE_ERROR, response.errors);
        });
    });
  },
  [REMOVE_PERMISSION_FROM_ROLE](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/removepermissionfromrole", payload)
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
            context.commit(SET_ROLE_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ROLE_ERROR, response.errors);
        });
    });
  },
  [CLEAR_ROLE_ERRORS](context) {
    context.commit(REMOVE_ROLE_ERRORS);
  }
};

const mutations = {
  [SET_ROLE_ERROR](state, error) {
    state.errors = error;
  },
  [REMOVE_ROLE_ERRORS](state) {
    state.errors = {};
  }
};

export default {
  state,
  actions,
  mutations
};
