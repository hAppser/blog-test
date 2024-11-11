"use client";
import { useState, useEffect } from "react";
import {
  useDeleteBulkPostsMutation,
  usePostsQuery,
  useBulkEditPostsMutation,
} from "@/entities/post/api/postQueries";
import { Post } from "@/entities/post/model/post.types";
import Pagination from "@/shared/ui/Pagination";
import { useRouter } from "next/navigation";
import { Textarea } from "@/shared/ui/Textarea";
import { Input } from "@/shared/ui/Input";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [editData, setEditData] = useState<{
    [key: string]: { title: string; shortDescription: string };
  }>({});
  const limit = 5;

  const { data, isLoading, error } = usePostsQuery({ page, limit });
  const { mutate: deletePosts, isPending: isDeleting } =
    useDeleteBulkPostsMutation();
  const { mutate: bulkEditPosts, isPending: isEditing } =
    useBulkEditPostsMutation();
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
    setEditData(initialEditData);
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

  const handleBulkEdit = async () => {
    const updates = selectedPosts.map((postId) => ({
      id: postId,
      title: editData[postId]?.title,
      description: editData[postId]?.shortDescription,
    }));

    try {
      await bulkEditPosts(updates);
      alert("Posts updated successfully!");
      setSelectedPosts([]);
    } catch (error) {
      console.error("Error editing posts", error);
    }
  };

  const handleEditChange = (
    postId: string,
    field: "title" | "shortDescription",
    value: string
  ) => {
    setEditData((prevData) => ({
      ...prevData,
      [postId]: {
        ...prevData[postId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Post Management</h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={handleBulkEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          disabled={selectedPosts.length === 0 || isEditing}
        >
          {isEditing ? "Editing..." : "Bulk Edit"}
        </button>
        <button
          onClick={handleBulkDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          disabled={selectedPosts.length === 0 || isDeleting}
        >
          {isDeleting ? "Deleting..." : "Bulk Delete"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post: Post & { _id: string }) => (
          <div
            key={post._id}
            className="border p-4 rounded shadow-sm flex flex-col"
          >
            <div className="flex items-center justify-between mb-2">
              <input
                type="checkbox"
                checked={selectedPosts.includes(post?._id)}
                onChange={() => handleSelectPost(post?._id)}
                className="mr-2"
              />
              <h2 className="text-lg font-semibold">{post.title}</h2>
            </div>
            <p className="text-sm text-gray-600">{post.shortDescription}</p>

            {selectedPosts.includes(post._id) && (
              <div className="mt-4">
                <div className="mb-2">
                  <Input
                    label="Title"
                    value={editData[post._id]?.title || ""}
                    onChange={(e) => handleEditChange(post._id, "title", e)}
                  />
                </div>

                <div className="mb-2">
                  <Textarea
                    label="Description"
                    value={editData[post._id]?.shortDescription || ""}
                    onChange={(e) =>
                      handleEditChange(post._id, "shortDescription", e)
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => router.push(`/post/${post._id}`)}
                className="text-blue-500 hover:underline"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
