import CustomerModel from "../models/customer.model.js";
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";

class DashboardService {
  async getSales(userID) {
    const orders = await OrderModel.find({ userID });
    const totalSales = orders.reduce((acc, order) => acc + order.amount, 0);
    return totalSales;
  }

  async getCost(userID) {
    const orders = await OrderModel.find({ userID });
    const totalCost = orders.reduce((acc, order) => acc + order.cost, 0);
    return totalCost;
  }

  async getProductSold(userID) {
    try {
      const orders = await OrderModel.find({ userID });
      let totalProductsSold = 0;
      orders.forEach((order) => {
        order.products.forEach((product) => {
          totalProductsSold += product.quantity;
        });
      });
      console.log(totalProductsSold);
      return totalProductsSold;
    } catch (error) {
      console.error("Failed to get total products sold:", error.message);
      throw new Error("Failed to get total products sold");
    }
  }

  async getRevenueChartData(userID) {
    // filter orders in the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setUTCMonth(twelveMonthsAgo.getUTCMonth() - 12);

    const orders = await OrderModel.find({
      userID,
      creation_date: { $gte: twelveMonthsAgo }, // Filter orders within the last 12 months
    });

    // filter the orders for each month and calculate the total amount of orders for each month
    // return the data
    const revenueData = {};

    orders.forEach((order) => {
      const monthYearKey = `${
        order.creation_date.getUTCMonth() + 1
      }/${order.creation_date.getUTCFullYear()}`;
      if (!revenueData[monthYearKey]) {
        revenueData[monthYearKey] = 0;
      }
      revenueData[monthYearKey] += order.amount; // Assuming totalAmount is the field containing order amount
    });

    const formattedRevenueData = Object.keys(revenueData).map((key) => ({
      monthYear: key,
      revenue: revenueData[key],
    }));

    return formattedRevenueData;
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
