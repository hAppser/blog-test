import Image from "next/image";
import Link from "next/link";
import { Post } from "../model/post.types";

type Props = {
  post: Post;
  className?: string;
};

export default function PostCard({ post, className }: Props) {
  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-lg flex flex-col h-full ${className}`}
    >
      <div className="relative w-full min-h-32 h-full">
        <Image
          src={post?.featuredImage || "/placeholder.svg"}
          alt={post.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h2 className="font-bold text-lg md:text-xl lg:text-2xl line-clamp-2">
          {post.title}
        </h2>

        <p className="text-gray-700 mt-2 text-sm md:text-base lg:text-lg line-clamp-3">
          {post.shortDescription}
        </p>

        <Link href={`/post/${post["_id"]}`} passHref>
          <span className="text-blue-500 mt-auto pt-2 block hover:underline">
            Read more
          </span>
        </Link>
      </div>
    </div>
  );
}
