import { Document, Types } from "mongoose";

export interface PostDocument extends Document {
  title: string;
  featuredImage?: ImageDocumet;
  shortDescription: string;
  mainImage?: ImageDocumet;
  articleContent: string;
}

export interface Post {
  title: string;
  featuredImage?: string;
  shortDescription: string;
  mainImage?: string;
  articleContent: string;
}

export interface ImageDocumet extends Document {
  postId: Types.ObjectId;
  data: string;
  type: string;
}

export interface Image {
  postId: Types.ObjectId;
  data: string;
  type: string;
}
