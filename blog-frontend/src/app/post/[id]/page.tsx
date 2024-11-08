"use client";
import { usePostQuery } from "@/entities/post/api/postQueries";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function PostPage() {
  const { id } = useParams();

  // Запрашиваем данные поста по ID
  const { data: post, isLoading, error } = usePostQuery(id as string);
  console.log(post);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      <div className="prose max-w-none" />
      {post?.articleContent}
    </div>
  );
}
