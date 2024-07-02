import ApiService from "@/core/services/api.service";
import { SET_SNACK } from "@/core/services/store/snackbar.module";
import JwtService from "@/core/services/jwt.service";
import { LOGOUT } from "@/core/services/store/auth.module";

// action types
export const UPLOADED_FILES = "UPLOADED_FILES";
export const UPLOAD_FILE = "upload_file";
export const UPDATE_FILES = "update_files";
export const DELETE_UPLOADED_FILE = "delete_uploaded_file";
export const DELETE_UPLOADED_LINK = "delete_uploaded_link";
export const CLEAR_UPLOAD_ERRORS = "clearUploadErrors";

// mutation types
export const SET_UPLOAD_ERRORS = "setUploadError";
export const REMOVE_UPLOAD_ERRORS = "removeUploadErrors";

const state = {
  errors: null,
  uploadedStateFiles: [],
  uploadedStateOtherFiles: {},
  uploadedStateOtherFilesSecond: {},
  uploadedStateLinks: {}
};

const actions = {
  [UPLOADED_FILES](context, payload) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      return new Promise(resolve => {
        ApiService.datatable(
          "api/getfiles?modelId=" +
            payload.modelId +
            "&model=" +
            payload.model +
            "&modelKey=" +
            payload.modelKey +
            "&moduleTitle=" +
            payload.moduleTitle +
            "&" +
            payload.q +
            payload.columns.join("")
        )
          .then(({ data }) => {
            resolve(data);
          })
          .catch(({ response }) => {
            // console.log(response);
            context.commit(SET_UPLOAD_ERRORS, response.errors);
          });
      });
    } else {
      this.$store.dispatch(LOGOUT);
    }
  },
  [UPLOAD_FILE](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/uploadfile", payload)
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
            context.commit(SET_UPLOAD_ERRORS, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_UPLOAD_ERRORS, response.errors);
        });
    });
  },
  [DELETE_UPLOADED_FILE](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/deleteuploadedfile", payload)
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
            context.commit(SET_UPLOAD_ERRORS, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_UPLOAD_ERRORS, response.errors);
        });
    });
  },
  [UPDATE_FILES](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/updatefiles", payload)
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
              context.commit(SET_UPLOAD_ERRORS, data.errors);
            }
          })
          .catch(({ response }) => {
            context.commit(SET_UPLOAD_ERRORS, response.errors);
          });
    });
  },
  [DELETE_UPLOADED_LINK](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/deleteuploadedlink", payload)
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
            context.commit(SET_UPLOAD_ERRORS, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_UPLOAD_ERRORS, response.errors);
        });
    });
  },
  [CLEAR_UPLOAD_ERRORS](context) {
    context.commit(REMOVE_UPLOAD_ERRORS);
  }
};

const mutations = {
  [SET_UPLOAD_ERRORS](state, error) {
    state.errors = error;
  },
  [REMOVE_UPLOAD_ERRORS](state) {
    state.errors = {};
  }
};

export default {
  state,
  actions,
  mutations
};
