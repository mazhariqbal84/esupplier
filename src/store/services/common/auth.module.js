import ApiService from "@/store/services/api.service";
import JwtService from "@/store/services/jwt.service";
import { SET_SNACK } from "@/store/services/common/snackbar";
//import router from "../../../router";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const REGISTER = "register";
export const SEND_VERIFICATION_EMAIL = "send_verification_email";
export const LOGOUT = "logout";
export const DO_LOGOUT = "doLogout";
export const CHANGE_PASSWORD = "changePassword";
export const CLEAR_AUTH_ERRORS = "clearAuthErrors";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_AUTH_ERRORS = "setAuthError";
export const REMOVE_AUTH_ERRORS = "removeAuthErrors";

const state = {
  errors: null,
  user: {},
  roles: [],
  permissions: [],
  isAuthenticated: !!JwtService.getToken()
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  }
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("api/auth/login", credentials)
        .then(({ data }) => {
          if (data._metadata.outcomeCode === 0) {
            context.commit(SET_AUTH, data);
            resolve(data);
          }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          } else {
            resolve(data);
            context.commit(SET_AUTH_ERRORS, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_AUTH_ERRORS, response.errors);
        });
    });
  },
  [REGISTER](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("api/auth/register", credentials)
        .then(({ data }) => {
          if (data._metadata.outcomeCode === 0) {
            resolve(data);
          }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          } else {
            resolve(data);
            context.commit(SET_AUTH_ERRORS, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_AUTH_ERRORS, response.errors);
        });
    });
  },
  [SEND_VERIFICATION_EMAIL](context, payload) {
    return new Promise(resolve => {
      ApiService.get("api/auth/email/resend", payload.email)
        .then(({ data }) => {
          if (data._metadata.outcomeCode === 0) {
            resolve(data);
          } else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          }else {
            resolve(data);
            context.commit(SET_AUTH_ERRORS, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_AUTH_ERRORS, response.errors);
        });
    });
  },
  [DO_LOGOUT](context) {
    ApiService.post("api/auth/logout")
      .then(({ data }) => {
        if (data._metadata.outcomeCode === 0) {
          this.dispatch(SET_SNACK, {
            clr: "success",
            msg: data._metadata.message
          });
          context.commit(PURGE_AUTH);
          sessionStorage.removeItem("key");
          router.push({ name: "login" });
        }else if ( data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
          window.open("/package-expire", "_self");
        } else {
          this.dispatch(SET_SNACK, {
            clr: "error",
            msg: data._metadata.message
          });
          context.commit(SET_AUTH_ERRORS, data.errors);
        }
      })
      .catch(({ response }) => {
        context.commit(SET_AUTH_ERRORS, response.errors);
      });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
    router.push({ name: "login" });
  },
  [CHANGE_PASSWORD](context, data) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      return new Promise((resolve, reject) => {
        ApiService.post("api/auth/changepassword", data)
          .then(({ data }) => {
            if (data._metadata.outcomeCode === 0) {
              this.dispatch(SET_SNACK, {
                clr: "success",
                msg: data._metadata.message
              });
              resolve(data);
            }else if ( data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
              window.open("/package-expire", "_self");
            } else {
              this.dispatch(SET_SNACK, {
                clr: "error",
                msg: data._metadata.message
              });
              context.commit(SET_AUTH_ERRORS, data.errors);
            }
          })
          .catch(({ response }) => {
            context.commit(SET_AUTH_ERRORS, response.errors);
            reject(response);
          });
      });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [VERIFY_AUTH](context, to) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      return new Promise(resolve => {
        ApiService.doVerify("api/auth/verify", { to: to })
          .then(({ data }) => {
            if (data._metadata.outcomeCode === 0) {
              context.commit(SET_AUTH, data);
              resolve(data);
            }else if ( data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
              window.open("/package-expire", "_self");
            } else {
              context.commit(PURGE_AUTH);
              this.$router.push({ path: "/login" });
            }
          })
          .catch(({ response }) => {
            context.commit(SET_AUTH_ERRORS, response.errors);
          });
      });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [CLEAR_AUTH_ERRORS](context) {
    context.commit(REMOVE_AUTH_ERRORS);
  }
};

const mutations = {
  [SET_AUTH_ERRORS](state, error) {
    state.errors = error;
  },
  [REMOVE_AUTH_ERRORS](state) {
    state.errors = {};
  },
  [SET_AUTH](state, data) {
    let uRoles = [];
    let uPermissions = [];
    if (data.records.permissions.length !== 0) {
      data.records.permissions.forEach(function (v) {
        uPermissions.push(v.name);
        // if (v.role_permissions && v.role_permissions.length !== 0) {
        //     v.role_permissions.forEach(function(vv) {
        //         uPermissions.push(vv.name);
        //     });
        // }
        // console.log(k.name);
      });
    }
    if (data.records.roles.length !== 0) {
      data.records.roles.forEach(function (v) {
        uRoles.push(v.name);
      });
    }
    state.isAuthenticated = true;
    state.user = data.records.user;
    state.roles = uRoles;
    state.permissions = uPermissions;
    state.errors = {};
    state.profile_completed = data.records.profile_completed;
    JwtService.saveToken(data.records.token);
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    JwtService.destroyToken();
  }
};

export default {
  state,
  actions,
  mutations
};
