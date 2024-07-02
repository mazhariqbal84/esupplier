import axios from "axios";
import JwtService from "@/store/services/jwt.service";

import {
  ADD_BODY_CLASSNAME,
  REMOVE_BODY_CLASSNAME,
} from "@/store/services/common/htmlclass.module";
//import { LOGOUT } from "@/store/services/common/auth.module";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
/**
 * Service to call HTTP request via Axios
 */

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ApiService = {
  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    axios.defaults.headers.common["Authorization"] = `${JwtService.getToken()}`;
  },

  query(resource, params) {
    return axios.get(resource, params).catch((error) => {
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  doVerify(resource, payload) {
    return new Promise(function (resolve, reject) {
      axios
        .get(`${resource}`)
        .then((data) => {
          if (data.data._metadata.outcomeCode === 400) {
            //useDispatch(LOGOUT);
            return false;
          }
          resolve(data);
        })
        .catch(function (error) {
          throw new Error(`${error}`);
        });
    });
  },

  datatable(resource) {
    useDispatch(isFormValid, false);
    return new Promise((resolve) => {
      return axios
        .get(`${resource}`)
        .then((data) => {
          if (data.data._metadata.outcomeCode === 200) {
            // store.dispatch(LOGOUT);
            return false;
          }
          resolve(data);
          useDispatch(isFormValid, true);
          useDispatch(REMOVE_BODY_CLASSNAME, "page-loading");
          //Scroll page to top on every route change
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        })
        .catch((error) => {
          throw new Error(`[KT] ApiService ${error}`);
        });
    });
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource, slug = "") {
    if (
      resource !== "api/auth/verify" &&
      resource !== "api/rolessimple" &&
      resource !== "api/categoriessimple"
    ) {
      // useDispatch(ADD_BODY_CLASSNAME, "page-loading");
    }
    if (slug !== "") {
      return new Promise(function (resolve, reject) {
        axios
          .get(`${resource}/${slug}`)
          .then((data) => {
            if (data.data._metadata.outcomeCode === 400) {
              //useDispatch(LOGOUT);
              return false;
            }
            resolve(data);
          })
          .catch(function (error) {
            throw new Error(`${error}`);
          });
      });
    } else {
      return new Promise(function (resolve, reject) {
        axios
          .get(`${resource}`)
          .then((data) => {
            if (data.data._metadata.outcomeCode === 400) {
              //useDispatch(LOGOUT);
              return false;
            }
            resolve(data);
          })
          .catch(function (error) {
            throw new Error(`${error}`);
          });
      });
    }
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    return new Promise(function (resolve, reject) {
      axios
        .post(`${resource}`, params)
        .then((data) => {
          if (data.data._metadata.outcomeCode === 400) {
            //useDispatch(LOGOUT);
            return false;
          }
          resolve(data);
        })
        .catch(function (error) {
          throw new Error(`${error}`);
        });
    });
  },
  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    useDispatch(ADD_BODY_CLASSNAME, "page-loading");
    return new Promise((resolve) => {
      return axios
        .post(`${resource}/${slug}`, params)
        .then((data) => {
          if (data.data._metadata.outcomeCode === 200) {
            //useDispatch(LOGOUT);
            return false;
          }
          resolve(data);
          useDispatch(REMOVE_BODY_CLASSNAME, "page-loading");
        })
        .catch((error) => {
          useDispatch(REMOVE_BODY_CLASSNAME, "page-loading");
          throw new Error(`[RWV] ApiService ${error}`);
        });
    });
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    return axios.put(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */

  delete(resource, slug) {
    return new Promise(function (resolve, reject) {
      axios
        .delete(`${resource}${slug ? `?${slug}` : ""}`)
        .then((data) => {
          if (data.data._metadata.outcomeCode === 400) {
            //useDispatch(LOGOUT);
            return false;
          }
          resolve(data);
        })
        .catch(function (error) {
          throw new Error(`${error}`);
        });
    });
  },
};

export default ApiService;
