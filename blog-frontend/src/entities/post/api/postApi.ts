import apiClient from "@/shared/api/apiClient";
import { Post } from "../model/post.types";

export const fetchPosts = async () => {
  const response = await apiClient.get("/posts");
  return response.data;
};

export const fetchPostById = async (id: string) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData: Post) => {
  const response = await apiClient.post("/posts", postData);
  console.log(postData);
  return response.data;
};

export const updatePost = async (id: string, updatedData: Partial<Post>) => {
  const response = await apiClient.put(`/posts/${id}`, updatedData);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response.data;
};
