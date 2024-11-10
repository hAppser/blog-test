"use client";
import { usePostQuery } from "@/entities/post/api/postQueries";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function PostPage() {
  const { id } = useParams();

  const { data: post, isLoading, error } = usePostQuery(id as string);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="flex justify-center items-center">
        {post.mainImage && (
          <Image
            src={post.mainImage}
            alt={post.title}
            width={640}
            height={360}
            className="w-1/2 rounded-lg mb-4"
            layout="intrinsic"
          />
        )}
      </div>

      <div className="prose max-w-none" />
      {post?.articleContent}
    </div>
  );
}
