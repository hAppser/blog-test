import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Post, ImageDocumet } from "./interfaces/post.interface";
import { Model, Types } from "mongoose";

@Injectable()
export class PostService {
  constructor(
    @InjectModel("Post") private readonly postModel: Model<Post>,
    @InjectModel("Image") private imageModel: Model<ImageDocumet>
  ) {}
  async createPost(postData: CreatePostDto): Promise<Post> {
    const session = await this.postModel.db.startSession();
    session.startTransaction();

    try {
      const newPost = new this.postModel({
        title: postData.title,
        shortDescription: postData.shortDescription,
        articleContent: postData.articleContent,
      });
      await newPost.save({ session });
      const imagesToSave = this.createImages(postData, newPost.id, session);

      await Promise.all(imagesToSave);
      await session.commitTransaction();
      return newPost;
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException("Failed to create post with images");
    } finally {
      session.endSession();
    }
  }

  private createImages(postData: CreatePostDto, postId: string, session: any) {
    const images = [];
    if (postData.featuredImage) {
      images.push(
        new this.imageModel({
          postId,
          data: postData.featuredImage,
          type: "featured",
        }).save({ session })
      );
    }

    if (postData.mainImage) {
      images.push(
        new this.imageModel({
          postId,
          data: postData.mainImage,
          type: "main",
        }).save({ session })
      );
    }

    return images;
  }

  async findImageByPostIdAndType(postId: string, type: "featured" | "main") {
    return this.imageModel.findOne({ postId, type }).exec();
  }

  async findAllPosts(): Promise<Post[]> {
    try {
      const posts = await this.postModel.find().exec();
      if (!posts || posts.length === 0) {
        throw new BadRequestException("No posts found");
      }

      const postsWithImages = await Promise.all(
        posts.map(async (post) => {
          const featuredImage = await this.findImageByPostIdAndType(
            post.id,
            "featured"
          );

          const mainImage = await this.findImageByPostIdAndType(
            post.id,
            "main"
          );

          return {
            ...post.toObject(),
            featuredImage: featuredImage?.data || null,
            mainImage: mainImage?.data || null,
          };
        })
      );

      return postsWithImages;
    } catch (error) {
      throw new BadRequestException("Failed to retrieve posts");
    }
  }

  async findPostById(id: string): Promise<Post> {
    try {
      const post = await this.postModel.findById(id).exec();
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      const featuredImage = await this.findImageByPostIdAndType(id, "featured");

      const mainImage = await this.findImageByPostIdAndType(id, "main");

      return {
        ...post.toObject(),
        featuredImage: featuredImage.data,
        mainImage: mainImage.data,
      };
    } catch (error) {
      throw new BadRequestException("Failed to retrieve post");
    }
  }

  async findPostByTitle(title: string): Promise<Post | null> {
    try {
      const post = await this.postModel.findOne({ title }).exec();
      if (!post) {
        throw new NotFoundException(`Post with title "${title}" not found`);
      }
      const featuredImage = await this.findImageByPostIdAndType(
        post.id,
        "featured"
      );

      const mainImage = await this.findImageByPostIdAndType(post.id, "main");

      return {
        ...post.toObject(),
        featuredImage: featuredImage.data,
        mainImage: mainImage.data,
      };
    } catch (error) {
      throw new BadRequestException("Failed to retrieve post");
    }
  }

  async updatePost(id: string, postData: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, postData, { new: true })
      .exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return updatedPost;
  }

  async removePost(id: string): Promise<Post> {
    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
    if (!deletedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return deletedPost;
  }
  // ToDo Bonus
  /*async updateManyPosts(
    ids: string[],
    updateData: Partial<Post>
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const result = await this.postModel
        .updateMany(
          { _id: { $in: ids } },
          { $set: updateData },
          { multi: true }
        )
        .exec();
      if (result.matchedCount === 0) {
        throw new NotFoundException("No posts found to update");
      }
      return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };
    } catch (error) {
      throw new BadRequestException("Failed to update posts");
    }
  }

  async removeManyPosts(ids: string[]): Promise<{ deletedCount: number }> {
    try {
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

      if (validIds.length === 0) {
        throw new BadRequestException(
          "No valid ObjectIds provided for deletion"
        );
      }
      const result = await this.postModel
        .deleteMany({ id: { $in: validIds } })
        .exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException("No posts found to delete");
      }

      return { deletedCount: result.deletedCount };
    } catch (error) {
      throw new BadRequestException("Failed to delete posts");
    }
  } */
}
