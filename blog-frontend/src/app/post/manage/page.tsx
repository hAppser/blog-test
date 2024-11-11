"use client";
import { useState, useEffect } from "react";
import {
  useDeleteBulkPostsMutation,
  usePostsQuery,
} from "@/entities/post/api/postQueries";
import { Post } from "@/entities/post/model/post.types";
import Pagination from "@/shared/ui/Pagination";
import { useRouter } from "next/navigation";
import PostCard from "@/entities/post/ui/PostCard";

export default function PostManagePage() {
  const [page, setPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const limit = 5;

  const { data, isLoading, error } = usePostsQuery({ page, limit });
  const { mutate: deletePosts, isPending: isDeleting } =
    useDeleteBulkPostsMutation();
  const router = useRouter();

  useEffect(() => {
    const initialEditData: {
      [key: string]: { title: string; shortDescription: string };
    } = {};
    selectedPosts.forEach((postId) => {
      const post = data?.posts.find(
        (post: { _id: string }) => post._id === postId
      );
      if (post) {
        initialEditData[postId] = {
          title: post.title,
          shortDescription: post.shortDescription,
        };
      }
    });
  }, [selectedPosts, data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;
  const { posts, total } = data;
  const totalPages = Math.ceil(total / limit);

  const handleSelectPost = (postId: string) => {
    setSelectedPosts((prevSelected) =>
      prevSelected.includes(postId)
        ? prevSelected.filter((id) => id !== postId)
        : [...prevSelected, postId]
    );
  };

  const handleBulkDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the selected posts?"
    );
    if (confirmed) {
      try {
        deletePosts(selectedPosts);
        setSelectedPosts([]);
      } catch (error) {
        console.error("Error deleting posts", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">Post Management</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
        <button
          onClick={handleBulkDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          disabled={selectedPosts.length === 0 || isDeleting}
        >
          {isDeleting ? "Deleting..." : "Bulk Delete"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6 flex-grow mb-10">
        {posts.map((post: Post & { _id: string }) => (
          <div
            key={post._id}
            className="relative border rounded-lg shadow-lg p-6"
          >
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={selectedPosts.includes(post._id)}
                onChange={() => handleSelectPost(post._id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <PostCard post={post} className="border-none" />
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="gap-2 p-2 rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
}
