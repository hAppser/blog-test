import { Schema } from "mongoose";
import { Post } from "../interfaces/post.interface";

export const PostSchema = new Schema<Post>(
  {
    title: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      required: false,
      default: null,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    mainImage: {
      type: String,
      required: false,
      default: null,
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
