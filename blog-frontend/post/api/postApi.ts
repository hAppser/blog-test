import { useQuery } from "@tanstack/react-query";
import apiClient from "shared/api/apiClient";

export const fetchPosts = async () => {
  const { data } = await apiClient.get("/posts");
  return data;
};

export const usePostsQuery = () => useQuery(["posts"], fetchPosts);

export const fetchPostById = async (id: string) => {
  const { data } = await apiClient.get(`/posts/${id}`);
  return data;
};

export const usePostQuery = (id: string) =>
  useQuery(["post", id], () => fetchPostById(id));
