import auth from "./auth.module";
import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";
import common from "./common.module";
import snackbar from "./snackbar.module";
import confirmation from "./confirmation.module";
import uploads from "./uploads.module";
import dashboard from "./dashboard.module";
import roles from "./roles.module";
import users from "./users.module";
import permissions from "./permissions.module";
import categories from "./categories.module";
import brands from "./brands.module";
import colors from "./colors.module";
import warrantytypes from "./warrantytypes.module";
import attributes from "./attributes.module";
import products from "./products.module";
import digitalproducts from "./digitalproducts.module";
import taxes from "./taxes.module";
import menus from "./menus.module";
import menuItems from "./menu_items.module";
import allorders from "./allorders.module";
import customers from "./customers.module";
import refundRequests from "./refundRequests.module";
import stupconfigurations from "./stupconfigurations.module";
import languages from "./languages.module";
import tickets from "./tickets.module";
import translations from "./translations.module";
import taxs from "./taxs.module";
import pickuppoints from "./pickuppoints.module";
import shipping from "./shipping.module";
import countries from "./countries.module";
import states from "./states.module";
import cities from "./cities.module";
import blogCategories from "./blog_gategories.module";
import posts from "./posts.module";
import flashDeals from "./flash_deals.module";
import coupons from "./coupons.module";
import banners from "./banners.module";
import reviews from "./reviews.module";
import reports from "./reports.module";
import clubPointSystem from "./clubPointSystem.module";
import bulkSms from "./bulkSms.module";
import paymentGateWays from "./paymentGateways.module";
import socialMediaLogins from "./socialMediaLogins.module";
import featuresActivation from "./featuresActivation.module";
import pages from "./pages.module";
import sellers from "./sellers.module";
import assign_product from "./assign_product.module";
import complaints from "./complaints.module";
import required_stock from "./required_stock.module";
import ledger from "./ledger.module";
import invoices from "./invoices.module";
import receive_required_stock from "./receive_required_stock.module";
import stock_sale_purchse_report from "./stock_sale_purchase_report.module";
import stock_report from "./stock_report.module";
import assign_orders from "./assign_orders.module";
import rider_payments from "./rider_payments.module";
import orderReturn from "./orderReturn.module"
import handToCourier from "./handToCourier.module"
import bulkUpdateProducts from "./bulkUpdateProducts.module";

export const indexSlice = createSlice({
    state: {
        appUrl: '',
        isFormValid: true,
    },
    modules: {
        auth,
        htmlClass,
        config,
        uploads,
        breadcrumbs,
        common,
        snackbar,
        confirmation,
        dashboard,
        roles,
        permissions,
        users,
        categories,
        menus,
        menuItems,
        brands,
        colors,
        warrantytypes,
        attributes,
        products,
        digitalproducts,
        taxes,
        allorders,
        customers,
        refundRequests,
        stupconfigurations,
        languages,
        tickets,
        translations,
        taxs,
        blogCategories,
        posts,
        pickuppoints,
        shipping,
        countries,
        cities,
        states,
        flashDeals,
        coupons,
        banners,
        reports,
        reviews,
        clubPointSystem,
        bulkSms,
        paymentGateWays,
        socialMediaLogins,
        featuresActivation,
        pages,
        sellers,
        assign_product,
        complaints,
        required_stock,
        ledger,
        invoices,
        receive_required_stock,
        stock_sale_purchse_report,
        stock_report,
        assign_orders,
        rider_payments,
        orderReturn,
        handToCourier,
        bulkUpdateProducts
    }
});
