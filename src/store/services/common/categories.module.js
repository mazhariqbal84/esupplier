import ApiService from "@/core/services/api.service";
import {SET_SNACK} from "@/core/services/store/snackbar.module";

// action types
export const CATEGORIES_LIST = "categories_list";
export const CREATE_CATEGORIES = "create_categories";
export const UPDATE_CATEGORIES = "update_categories";
export const DELETE_CATEGORIES = "delete_categories";
export const GET_CATEGORIES_DETAILS = "get_categories_details";
export const CATEGORIES_SIMPLE_LIST = "categories_simple_details";
export const CATEGORIES_TREE_LIST = "categories_tree_list";
export const SAVE_CATEGORIES_TREE = "save_categories_tree";
export const UPDATE_CATEGORY_STATUS = "update_category_status";
export const CLEAR_CATEGORIES_ERRORS = "clearCategoriesErrors";

// mutation types
export const SET_CATEGORIES_ERROR = "setCategoriesErrors";
export const REMOVE_CATEGORIES_ERRORS = "removeCategoriesErrors";

const state = {
    errors: null
};
const actions = {
    [CATEGORIES_LIST](context, payload) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.datatable("api/categories?" + payload.q + payload.columns.join(''))
                .then(({data}) => {
                    if (data._metadata.outcomeCode === 0) {
                        resolve(data);
                    }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                        window.open("/package-expire", "_self");
                      } else {
                        this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                        context.commit(SET_CATEGORIES_ERROR, data.errors);
                    }
                })
                .catch(({response}) => {
                    context.commit(SET_CATEGORIES_ERROR, response.errors);
                });
        });
    },
    [CREATE_CATEGORIES](context, payload) {
        return new Promise(resolve => {
            return ApiService.post("api/createcategory", payload.data).then(({data}) => {
                if (data._metadata.outcomeCode === 0) {
                    this.dispatch(SET_SNACK, {clr: 'success', msg: data._metadata.message});
                    resolve(data);
                }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                    window.open("/package-expire", "_self");
                  } else {
                    this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                    context.commit(SET_CATEGORIES_ERROR, data.errors);
                }
            })
                .catch(({response}) => {
                    context.commit(SET_CATEGORIES_ERROR, response.errors);
                });
        });
    },
    [UPDATE_CATEGORIES](context, payload) {
        return new Promise(resolve => {
            return ApiService.update("api/updatecategory", payload.slug, payload.data).then(({data}) => {
                if (data._metadata.outcomeCode === 0) {
                    this.dispatch(SET_SNACK, {clr: 'success', msg: data._metadata.message});
                    resolve(data);
                }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                    window.open("/package-expire", "_self");
                  } else {
                    this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                    context.commit(SET_CATEGORIES_ERROR, data.errors);
                }
            })
                .catch(({response}) => {
                    context.commit(SET_CATEGORIES_ERROR, response.errors);
                });
        });
    },
    [DELETE_CATEGORIES](context, payload) {
        return new Promise(resolve => {
            return ApiService.post("api/deletecategory", payload).then(({data}) => {
                if (data._metadata.outcomeCode === 0) {
                    this.dispatch(SET_SNACK, {clr: 'success', msg: data._metadata.message});
                    resolve(data);
                }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                    window.open("/package-expire", "_self");
                  } else {
                    this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                    context.commit(SET_CATEGORIES_ERROR, data.errors);
                }
            })
                .catch(({response}) => {
                    context.commit(SET_CATEGORIES_ERROR, response.errors);
                });
        });
    },
    [GET_CATEGORIES_DETAILS](context, id) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.get("api/getcategorydetail", id)
                .then(({data}) => {
                    if (data._metadata.outcomeCode === 0) {
                        resolve(data);
                    }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                        window.open("/package-expire", "_self");
                      } else {
                        this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                        context.commit(SET_CATEGORIES_ERROR, data.errors);
                    }
                })
                .catch(({response}) => {
                    context.commit(SET_CATEGORIES_ERROR, response.errors);
                });
        });
    },
    [CLEAR_CATEGORIES_ERRORS](context) {
        context.commit(REMOVE_CATEGORIES_ERRORS);
    },
    [CATEGORIES_SIMPLE_LIST](context, payload) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.datatable("api/categoriessimple?digital=" + payload.digital)
                .then(({data}) => {
                    if (data._metadata.outcomeCode === 0) {
                        resolve(data);
                    } else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                        window.open("/package-expire", "_self");
                      }else {
                        this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                    }
                }).catch(({response}) => {
                context.commit(SET_CATEGORIES_ERROR, response.errors);
            });
        });
    },
    [CATEGORIES_TREE_LIST](context) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.get("api/categoriestree")
                .then(({data}) => {
                    if (data._metadata.outcomeCode === 0) {
                        resolve(data);
                    } else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                        window.open("/package-expire", "_self");
                      }else {
                        this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                    }
                }).catch(({response}) => {
                context.commit(SET_CATEGORIES_ERROR, response.errors);
            });
        });
    },
    [SAVE_CATEGORIES_TREE](context, payload) {
        return new Promise(resolve => {
            return ApiService.post("api/savecategoriestree", payload.data).then(({data}) => {
                if (data._metadata.outcomeCode === 0) {
                    this.dispatch(SET_SNACK, {clr: 'success', msg: data._metadata.message});
                    resolve(data);
                }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                    window.open("/package-expire", "_self");
                  } else {
                    this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                    context.commit(SET_CATEGORIES_ERROR, data.errors);
                }
            })
                .catch(({response}) => {
                    context.commit(SET_CATEGORIES_ERROR, response.errors);
                });
        });
    },
    [UPDATE_CATEGORY_STATUS](context, payload) {
        return new Promise(resolve => {
            return ApiService.update("api/updatecategorystatus", payload.slug, payload.data).then(({data}) => {
                if (data._metadata.outcomeCode === 0) {
                    this.dispatch(SET_SNACK, {clr: 'success', msg: data._metadata.message});
                    resolve(data);
                }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                    window.open("/package-expire", "_self");
                  } else {
                    this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                    context.commit(SET_CATEGORIES_ERROR, data.errors);
                }
            })
                .catch(({response}) => {
                    context.commit(SET_CATEGORIES_ERROR, response.errors);
                });
        });
    },
};

const mutations = {
    [SET_CATEGORIES_ERROR](state, error) {
        state.errors = error;
    },
    [REMOVE_CATEGORIES_ERRORS](state) {
        state.errors = {};
    }
};

export default {
    state,
    actions,
    mutations
};
