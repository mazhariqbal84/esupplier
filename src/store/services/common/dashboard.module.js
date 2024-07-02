import ApiService from "@/core/services/api.service";
import {SET_SNACK} from "@/core/services/store/snackbar.module";

// action types
export const DASHBOARD_ORDERS_STATS = "DASHBOARD_ORDERS_STATS";
export const DASHBOARD_SEARCH_STATS = "DASHBOARD_SEARCH_STATS";
export const DASHBOARD_TOP_BUYER = "DASHBOARD_TOP_BUYER";
export const DASHBOARD_USER_SEARCHES = "DASHBOARD_USER_SEARCHES";
export const DASHBOARD_RTV_PRODUCTS = "DASHBOARD_RTV_PRODUCTS";
export const DASHBOARD_TOP_SELLING_PRODUCT = "DASHBOARD_TOP_SELLING_PRODUCT";
export const DASHBOARD_MOST_VIEWED_PRODUCT = "DASHBOARD_MOST_VIEWED_PRODUCT";
export const CLEAR_DASHBOARD_ERRORS = "clearDashboardErrors";

// mutation types
export const SET_DASHBOARD_ERROR = "setDashboardError";
export const REMOVE_DASHBOARD_ERRORS = "removeDashboardErrors";

const state = {
    errors: null
};
const actions = {
    [DASHBOARD_ORDERS_STATS](context) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.datatable("api/dashboardordersstats")
                .then(({data}) => {
                    if (data._metadata.outcomeCode === 0) {
                        resolve(data);
                    } else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                        window.open("/package-expire", "_self");
                      }else {
                        this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                        context.commit(SET_DASHBOARD_ERROR, data.errors);
                    }
                })
                .catch(({response}) => {
                    context.commit(SET_DASHBOARD_ERROR, response.errors);
                });
        });
    },
    [DASHBOARD_TOP_SELLING_PRODUCT](context, payload = {q:'',columns: []}) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.datatable("api/dashboartopsellingproducts?" + payload.q + payload.columns.join(""))
                .then(({data}) => {
                    if (data._metadata.outcomeCode === 0) {
                        resolve(data);
                    } else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                        window.open("/package-expire", "_self");
                      }else {
                        this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                        context.commit(SET_DASHBOARD_ERROR, data.errors);
                    }
                })
                .catch(({response}) => {
                    context.commit(SET_DASHBOARD_ERROR, response.errors);
                });
        });
    },
    [DASHBOARD_MOST_VIEWED_PRODUCT](context, payload = {q:'',columns: []} ) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.datatable("api/dashboarmostviewedproducts?" + payload.q + payload.columns.join(""))
                .then(({data}) => {
                    if (data._metadata.outcomeCode === 0) {
                        resolve(data);
                    }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                        window.open("/package-expire", "_self");
                      } else {
                        this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                        context.commit(SET_DASHBOARD_ERROR, data.errors);
                    }
                })
                .catch(({response}) => {
                    context.commit(SET_DASHBOARD_ERROR, response.errors);
                });
        });
    },
    [DASHBOARD_SEARCH_STATS](context, payload) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.datatable("api/dashboarusersearches")
                .then(({data}) => {
                    if (data._metadata.outcomeCode === 0) {
                        resolve(data);
                    }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                        window.open("/package-expire", "_self");
                      } else {
                        this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                        context.commit(SET_DASHBOARD_ERROR, data.errors);
                    }
                })
                .catch(({response}) => {
                    context.commit(SET_DASHBOARD_ERROR, response.errors);
                });
        });
    },
    [DASHBOARD_TOP_BUYER](context, payload = {q:'',columns: []}) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.datatable("api/dashboartopcustomer?" + payload.q + payload.columns.join(""))
                .then(({data}) => {
                    if (data._metadata.outcomeCode === 0) {
                        resolve(data);
                    }else if (data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
                        window.open("/package-expire", "_self");
                      } else {
                        this.dispatch(SET_SNACK, {clr: 'error', msg: data._metadata.message});
                        context.commit(SET_DASHBOARD_ERROR, data.errors);
                    }
                })
                .catch(({response}) => {
                    context.commit(SET_DASHBOARD_ERROR, response.errors);
                });
        });
    },
    [DASHBOARD_USER_SEARCHES](context, payload = {q:'',columns: []}) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.datatable("api/dashboarusersearches?" + payload.q + payload.columns.join(""))
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
                        context.commit(SET_DASHBOARD_ERROR, data.errors);
                    }
                })
                .catch(({ response }) => {
                    context.commit(SET_DASHBOARD_ERROR, response.errors);
                });
        });
    },
    [DASHBOARD_RTV_PRODUCTS](context, payload = {q:'',columns: []}) {
        ApiService.setHeader();
        return new Promise(resolve => {
            ApiService.datatable("api/dashboardrtvproducts?" + payload.q + payload.columns.join(""))
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
                        context.commit(SET_DASHBOARD_ERROR, data.errors);
                    }
                })
                .catch(({ response }) => {
                    context.commit(SET_DASHBOARD_ERROR, response.errors);
                });
        });
    },
    
    [CLEAR_DASHBOARD_ERRORS](context) {
        context.commit(REMOVE_DASHBOARD_ERRORS);
    },
};

const mutations = {
    [SET_DASHBOARD_ERROR](state, error) {
        state.errors = error;
    },
    [REMOVE_DASHBOARD_ERRORS](state) {
        state.errors = {};
    }
};

export default {
    state,
    actions,
    mutations
};
