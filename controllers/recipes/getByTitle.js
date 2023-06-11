const { Recipe } = require("../../models/recipe");
const { RequestError } = require("../../helpers");

const getByTitle = async (req, res) => {
  const { title } = req.query;

  if (!title) {
    throw RequestError(400, "Title parameter is required");
  }

  const regex = new RegExp(title, "i");

  const { page = 1, limit = 1 } = req.query;
  const skip = (page - 1) * limit;
  const count = await Recipe.countDocuments({ title: regex });
  const response = await Recipe.find({ title: regex }, "-createdAt -updatedAt")
    .skip(skip)
    .limit(limit);

  res.status(200).json({ response, total: count });

  if (!response) {
    throw RequestError(404, "Not found");
  }
};

module.exports = getByTitle;