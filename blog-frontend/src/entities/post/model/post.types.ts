export interface Post {
  _id?: string;
  title: string;
  featuredImage?: string | null;
  mainImage?: string | null;
  shortDescription: string;
  articleContent: string;
}
