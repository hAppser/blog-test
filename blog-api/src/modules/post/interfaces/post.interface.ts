import { Document } from "mongoose";

export interface Post extends Document {
  title: string;
  featuredImage?: string;
  shortDescription: string;
  mainImage?: string;
  articleContent: string;
}
