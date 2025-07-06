const User = require('./models/User');

// Create
const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

// Read all
const getAllUsers = async () => {
  return await User.find();
};

// Read by ID
const getUserById = async (id) => {
  return await User.findById(id);
};

// Update
const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete
const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};