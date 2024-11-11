"use client";
import { useState } from "react";
import { usePostsQuery } from "@/entities/post/api/postQueries";
import { Post } from "@/entities/post/model/post.types";
import PostCard from "@/entities/post/ui/PostCard";
import Link from "next/link";
import Pagination from "@/shared/ui/Pagination";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, error } = usePostsQuery({ page, limit });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;
  const { posts = [], total } = data;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/post/new">
          <span className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
            Create New Post
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post: Post) => (
          <PostCard key={post["_id"]} post={post} />
        ))}
      </div>
      {posts.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
