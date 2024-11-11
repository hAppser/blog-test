import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
} from "./postApi";
import { Post } from "../model/post.types";

export const usePostsQuery = ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["posts", page, limit],
    queryFn: ({ queryKey }) => {
      return fetchPosts({ page, limit });
    },
  });
};

export const usePostQuery = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id),
    enabled: !!id,
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; updatedData: Partial<Post> }) =>
      updatePost(data.id, data.updatedData),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
