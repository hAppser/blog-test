import { Schema } from "mongoose";
import { Post } from "../interfaces/post.interface";

export const PostSchema = new Schema<Post>(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    articleContent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
