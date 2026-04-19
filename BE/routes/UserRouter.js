const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const router = express.Router();

router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}, "_id first_name last_name").lean();
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ message: "Unable to fetch user list." });
  }
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).json({ message: `Invalid user id: ${id}.` });
    return;
  }

  try {
    const user = await User.findById(
      id,
      "_id first_name last_name location description occupation",
    ).lean();

    if (!user) {
      response.status(400).json({ message: `No user found with id: ${id}.` });
      return;
    }

    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ message: "Unable to fetch user detail." });
  }
});

module.exports = router;
