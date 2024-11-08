export interface Post {
  _id: string;
  title: string;
  featuredImage?: string | null;
  mainImage?: string;
  shortDescription: string;
  articleContent: string;
}
