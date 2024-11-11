import apiClient from "@/shared/api/apiClient";
import { Post } from "../model/post.types";

export const fetchPosts = async ({ page = 1, limit = 10 }) => {
  const response = await apiClient.get("/posts", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const fetchPostById = async (id: string) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData: Post) => {
  const response = await apiClient.post("/posts", postData);
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

export const deletBulkPosts = async (postIds: string[]) => {
  await apiClient.post(`/posts/bulk-delete`, { ids: postIds });
};

export const updateBulkPosts = async (
  updates: { id: string; title: string; description: string }[]
) => {
  return apiClient.put("/posts/bulk-edit", updates);
};
