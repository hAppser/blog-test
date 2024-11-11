"use client";

import React, { useState, useEffect } from "react";
import { usePostQuery } from "@/entities/post/api/postQueries";
import { useUpdatePostMutation } from "@/entities/post/api/postQueries";
import { CKEditorField } from "@/shared/ui/CKEditorField";
import { Textarea } from "@/shared/ui/Textarea";
import { Input } from "@/shared/ui/Input";
import ImageUpload from "@/shared/ui/ImageUpload";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: post, isLoading, error } = usePostQuery(id as string);
  const { mutate: updatePost, isPending } = useUpdatePostMutation();

  const [title, setTitle] = useState(post?.title || "");
  const [shortDescription, setShortDescription] = useState(
    post?.shortDescription || ""
  );
  const [articleContent, setArticleContent] = useState(
    post?.articleContent || ""
  );
  const [mainImageBase64, setMainImageBase64] = useState<string | null>(
    post?.mainImage || null
  );
  const [secondaryImageBase64, setFeaturedImageBase64] = useState<
    string | null
  >(post?.featuredImage || null);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    content?: string;
  }>({});

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setShortDescription(post.shortDescription);
      setArticleContent(post.articleContent);
      setMainImageBase64(post.mainImage);
      setFeaturedImageBase64(post.featuredImage);
    }
  }, [post]);

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

    updatePost({
      id: id as string,
      updatedData: {
        title,
        shortDescription,
        articleContent,
        mainImage: mainImageBase64,
        featuredImage: secondaryImageBase64,
      },
    });
    router.push("/");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Blog Post</h1>
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
        <CKEditorField
          label="Content"
          value={articleContent}
          onChange={setArticleContent}
          error={errors.content}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update Post"}
        </button>
      </form>

      <div className="mt-4">
        <Link href="/" passHref>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
