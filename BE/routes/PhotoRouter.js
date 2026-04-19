const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.get("/photosOfUser/:id", async (request, response) => {
  const { id } = request.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).json({ message: `Invalid user id: ${id}.` });
    return;
  }

  try {
    const targetUser = await User.findById(id, "_id").lean();
    if (!targetUser) {
      response.status(400).json({ message: `No user found with id: ${id}.` });
      return;
    }

    const photos = await Photo.find(
      { user_id: id },
      "_id user_id comments file_name date_time",
    ).lean();

    const commentUserIds = [
      ...new Set(
        photos.flatMap((photo) =>
          (photo.comments || []).map((comment) => String(comment.user_id)),
        ),
      ),
    ];

    const commentUsers = commentUserIds.length
      ? await User.find(
          { _id: { $in: commentUserIds } },
          "_id first_name last_name",
        ).lean()
      : [];

    const commentUserMap = new Map(
      commentUsers.map((user) => [String(user._id), user]),
    );

    const apiPhotos = photos.map((photo) => ({
      _id: photo._id,
      user_id: photo.user_id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      comments: (photo.comments || []).map((comment) => ({
        _id: comment._id,
        comment: comment.comment,
        date_time: comment.date_time,
        user: commentUserMap.get(String(comment.user_id)) || {
          _id: comment.user_id,
          first_name: "Unknown",
          last_name: "User",
        },
      })),
    }));

    response.status(200).json(apiPhotos);
  } catch (error) {
    response.status(500).json({ message: "Unable to fetch user photos." });
  }
});

module.exports = router;
