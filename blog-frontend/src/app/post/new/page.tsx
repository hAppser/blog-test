"use client";

import React, { useState } from "react";

import { useCreatePostMutation } from "@/entities/post/api/postQueries";
import { convertImageToBase64 } from "@/shared/utils/convertImageToBase64";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [articleContent, setArticleContent] = useState("<h3>Test Image</h3>");
  const [mainImageBase64, setMainImageBase64] = useState<string | null>(null);
  const [secondaryImageBase64, setFeaturedImageBase64] = useState<
    string | null
  >(null);
  const { mutate: createPost, isPending } = useCreatePostMutation();
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageBase64: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      convertImageToBase64(file, setImageBase64);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title,
      shortDescription,
      articleContent,
      mainImage: mainImageBase64,
      featuredImage: secondaryImageBase64,
    };

    createPost(postData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Blog Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Main Image
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setMainImageBase64)}
            accept="image/*"
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Featured Image
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setFeaturedImageBase64)}
            accept="image/*"
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
