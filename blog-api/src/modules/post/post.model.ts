import { Document, Model, model } from "mongoose";
import { PostSchema } from "./schemas/post.schema";
import { Post } from "./interfaces/post.interface";

export interface PostDocument extends Post, Document {}

export const PostModel: Model<PostDocument> = model<PostDocument>(
  "Post",
  PostSchema
);
