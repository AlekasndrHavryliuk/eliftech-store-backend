import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { Orders } from "../models/orders.js";

const getOrders = async (req, res) => {
  const { _id: userId } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const filter = {
    userId,
  };
  const totalOrders = await Orders.countDocuments({});
  const orders = await Orders.find(filter, "", {
    skip,
    limit,
  });
  res.json({ orders, totalOrders: Math.ceil(totalOrders / limit) });
};

const postOrder = async (req, res) => {
  const { _id: userId } = req.user;
  const { items } = req.body;
  if (!items.length) throw HttpError(400, "Items is empty");
  const totalPrice = items.reduce((acc, item) => {
    const value = +item.price * +item.count;
    return acc + value;
  }, 0);
  const correctPrice = totalPrice.toFixed(2);
  const order = await Orders.create({ userId, items, correctPrice });
  res.status(201).json(order);
};

const getAllOrders = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const totalOrders = await Orders.countDocuments({});
  const orders = await Orders.find({}, "", {
    skip,
    limit,
  });
  res.status(201).json({ orders, totalOrders: Math.ceil(totalOrders / limit) });
};

export const getOrdersCtrl = ctrlWrapper(getOrders);
export const getAllOrdersCtrl = ctrlWrapper(getAllOrders);
export const postOrderCtrl = ctrlWrapper(postOrder);
