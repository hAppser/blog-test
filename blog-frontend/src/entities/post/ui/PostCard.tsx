import Image from "next/image";
import Link from "next/link";
import { Post } from "../model/post.types";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      {post.featuredImage && (
        <Image
          src={post.featuredImage}
          alt={post.title}
          width={640}
          height={360}
          className="w-full h-48 object-cover rounded-lg"
          layout="intrinsic"
        />
      )}

      <div className="p-4">
        <h2 className="font-bold text-lg">{post.title}</h2>
        <p className="text-gray-700">{post.shortDescription}</p>
        <Link href={`/post/${post["_id"]}`}>
          <span className="text-blue-500 mt-2 block">Read more</span>
        </Link>
      </div>
    </div>
  );
}
