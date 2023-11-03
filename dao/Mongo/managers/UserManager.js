import userModel from "../models/user.js";

export default class UserManager {
  get = async () => {
    return await userModel.find().lean();
  };
  getBy = async (params) => {
    return await userModel.findOne(params).lean();
  };

  create = async (user) => {
    return await userModel.create(user);
  }
}
