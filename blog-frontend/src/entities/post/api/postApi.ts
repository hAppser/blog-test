import apiClient from "@/shared/api/apiClient";

export const fetchPosts = async () => {
  const response = await apiClient.get("/posts");
  return response.data;
};

// Получение одного поста по ID
export const fetchPostById = async (id: string) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data;
};

// Создание нового поста
export const createPost = async (postData: {
  title: string;
  description: string;
  content: string;
  image: string;
}) => {
  const response = await apiClient.post("/posts", postData);
  return response.data;
};

// Обновление поста по ID
export const updatePost = async (
  id: string,
  updatedData: {
    title?: string;
    description?: string;
    content?: string;
    image?: string;
  }
) => {
  const response = await apiClient.put(`/posts/${id}`, updatedData);
  return response.data;
};

// Удаление поста по ID
export const deletePost = async (id: string) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response.data;
};
