"use client";
import { usePostsQuery } from "@/entities/post/api/postQueries";
import { Post } from "@/entities/post/model/post.types";
import PostCard from "@/entities/post/ui/PostCard";

export default function HomePage() {
  const { data: posts, isLoading, error } = usePostsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post: Post) => (
          <PostCard key={post["_id"]} post={post} />
        ))}
      </div>
    </div>
  );
}
