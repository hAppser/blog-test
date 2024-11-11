"use client";

import {
  usePostQuery,
  useDeletePostMutation,
} from "@/entities/post/api/postQueries";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { useState } from "react";
import Link from "next/link";

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: post, isLoading, error } = usePostQuery(id as string);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePostMutation();

  const [menuOpen, setMenuOpen] = useState(false);

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error loading post</div>;

  const cleanArticleContent = DOMPurify.sanitize(post?.articleContent || "");

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmed) {
      try {
        deletePost(post._id);
        router.push("/");
      } catch (error) {
        console.error("Error deleting post", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-center mb-2">{post.title}</h1>
        <div className="flex justify-center items-center space-x-4 mb-4">
          <span className="text-gray-600 text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="text-gray-600 text-sm">
            by {post.author || "Anonymous"}
          </span>
        </div>
      </header>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/")}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
        >
          Back to Home
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Actions
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
              <ul>
                <li>
                  <Link
                    href={`/post/edit/${post._id}`}
                    className="block px-4 py-2 text-black hover:bg-gray-200 rounded-t-md"
                    onClick={() => setMenuOpen(false)}
                  >
                    Edit Post
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleDelete}
                    className="block px-4 py-2 text-red-500 hover:bg-gray-200 rounded-b-md w-full text-left"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Post"}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full justify-center items-center mb-6">
        <Image
          src={post.mainImage || "../placeholder.svg"}
          alt={post.title}
          width={640}
          height={360}
          className="w-full md:w-1/2 rounded-lg shadow-md"
          layout="intrinsic"
        />
      </div>

      <section className="prose mx-auto max-w-full">
        <div
          className="max-w-none"
          dangerouslySetInnerHTML={{ __html: cleanArticleContent }}
        />
      </section>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Comments</h3>
        <div className="bg-gray-100 p-4 rounded-md shadow-sm">
          <p className="text-gray-600">
            No comments yet. Be the first to comment!
          </p>
        </div>
      </div>
    </div>
  );
}
