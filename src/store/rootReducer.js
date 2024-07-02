import auth from "../pages/auth/common/store";
import confirmation from "./services/common/confirmation.module";
import invoices from "../pages/invoice/store/store";
import categories from "../pages/category/store/store";
import brands from "../pages/brand/store/store";
import attributes from "../pages/attribute/store/store";
import products from "../pages/product/store/store";
import layout from "./layout";
import loader from "./loader";

const rootReducer = {
  layout,
  auth,
  loader,
  invoices,
  categories,
  confirmation,
  brands,
  products,
  attributes
};
export default rootReducer;
