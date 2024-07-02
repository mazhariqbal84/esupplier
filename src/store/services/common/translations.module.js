import ApiService from "@/core/services/api.service";
import { SET_SNACK } from "@/core/services/store/snackbar.module";

// action types
export const TRANSLATIONS_LIST = "translations_list";
export const CREATE_TRANSLATION = "create_translation";
export const UPDATE_TRANSLATION = "update_translation";
export const DELETE_TRANSLATION = "delete_translation";
export const UPDATE_TRANSLATION_KEYVALUE = "update_translation_keyvalue";
export const GET_TRANSLATION_DETAILS = "get_translation_details";
export const CLEAR_TRANSLATION_ERRORS = "clearTranslationErrors";

// mutation types
export const SET_TRANSLATION_ERROR = "setTranslationError";
export const REMOVE_TRANSLATION_ERRORS = "removeTranslationErrors";

const state = {
  errors: null
};
const actions = {
  [TRANSLATIONS_LIST](context, payload) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.datatable(
        "api/translations/" +
          payload.slug +
          "?" +
          payload.q +
          payload.columns.join("")
      )
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
            context.commit(SET_TRANSLATION_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_TRANSLATION_ERROR, response.errors);
        });
    });
  },
  [CREATE_TRANSLATION](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/createTranslation", payload.data)
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
            context.commit(SET_TRANSLATION_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_TRANSLATION_ERROR, response.errors);
        });
    });
  },
  [UPDATE_TRANSLATION](context, payload) {
    return new Promise(resolve => {
      return ApiService.update(
        "api/updatetranslation",
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
          } else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          }else {
            this.dispatch(SET_SNACK, {
              clr: "error",
              msg: data._metadata.message
            });
            context.commit(SET_TRANSLATION_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_TRANSLATION_ERROR, response.errors);
        });
    });
  },
  [DELETE_TRANSLATION](context, payload) {
    return new Promise(resolve => {
      return ApiService.post("api/deletetranslation", payload)
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
            context.commit(SET_TRANSLATION_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_TRANSLATION_ERROR, response.errors);
        });
    });
  },
  [GET_TRANSLATION_DETAILS](context, id) {
    ApiService.setHeader();
    return new Promise(resolve => {
      ApiService.get("api/gettranslationdetail", id)
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
            context.commit(SET_TRANSLATION_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_TRANSLATION_ERROR, response.errors);
        });
    });
  },
  [UPDATE_TRANSLATION_KEYVALUE](context, payload) {
    return new Promise(resolve => {
      return ApiService.update(
        "api/updatetranslationkv",
        payload.slug,
        payload.data
      )
        .then(({ data }) => {
          if (data._metadata.outcomeCode === 0) {
            // this.dispatch(SET_SNACK, {clr: 'success', msg: data._metadata.message});
            resolve(data);
          } else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          }else {
            this.dispatch(SET_SNACK, {
              clr: "error",
              msg: data._metadata.message
            });
            context.commit(SET_TRANSLATION_ERROR, data.errors);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_TRANSLATION_ERROR, response.errors);
        });
    });
  },
  [CLEAR_TRANSLATION_ERRORS](context) {
    context.commit(REMOVE_TRANSLATION_ERRORS);
  }
};

const mutations = {
  [SET_TRANSLATION_ERROR](state, error) {
    state.errors = error;
  },
  [REMOVE_TRANSLATION_ERRORS](state) {
    state.errors = {};
  }
};

export default {
  state,
  actions,
  mutations
};
