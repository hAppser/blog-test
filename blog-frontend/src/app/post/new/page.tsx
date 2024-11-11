"use client";

import React, { useEffect, useState } from "react";
import { useCreatePostMutation } from "@/entities/post/api/postQueries";
import { DraftEditorField } from "@/shared/ui/DraftEditorField";
import { Textarea } from "@/shared/ui/Textarea";
import { Input } from "@/shared/ui/Input";
import ImageUpload from "@/shared/ui/ImageUpload";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [mainImageBase64, setMainImageBase64] = useState<string | null>(null);
  const [secondaryImageBase64, setFeaturedImageBase64] = useState<
    string | null
  >(null);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    content?: string;
  }>({});
  const router = useRouter();
  const { mutate: createPost, isPending } = useCreatePostMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: {
      title?: string;
      description?: string;
      content?: string;
    } = {};

    if (!title) validationErrors.title = "Title is required";
    if (!shortDescription)
      validationErrors.description = "Description is required";
    if (!articleContent) validationErrors.content = "Content is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    createPost({
      title,
      shortDescription,
      articleContent,
      mainImage: mainImageBase64,
      featuredImage: secondaryImageBase64,
    });
    router.push("/");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold mb-4">Create New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-1">
        <Input
          label="Title"
          value={title}
          onChange={setTitle}
          error={errors.title}
        />
        <Textarea
          label="Description"
          value={shortDescription}
          onChange={setShortDescription}
          error={errors.description}
        />
        <ImageUpload
          label="Main Image"
          onImageUpload={(base64) => setMainImageBase64(base64)}
        />
        <ImageUpload
          label="Featured Image"
          onImageUpload={(base64) => setFeaturedImageBase64(base64)}
        />
        {isClient ? (
          <DraftEditorField
            label="Content"
            value={articleContent}
            onChange={setArticleContent}
            error={errors.content}
          />
        ) : null}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Post"}
        </button>
      </form>

      <div className="mt-4"></div>
    </div>
  );
}
