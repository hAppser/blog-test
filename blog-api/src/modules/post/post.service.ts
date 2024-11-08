import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./interfaces/post.interface";
import { Model, Types } from "mongoose";

@Injectable()
export class PostService {
  constructor(@InjectModel("Post") private readonly postModel: Model<Post>) {}
  async createPost(postData: CreatePostDto): Promise<Post> {
    try {
      const newPost = new this.postModel(postData);
      return await newPost.save();
    } catch (error) {
      throw new BadRequestException("Failed to create post");
    }
  }

  async findAllPosts(): Promise<Post[]> {
    try {
      return await this.postModel.find().exec();
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
      return post;
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
      return post;
    } catch (error) {
      throw new BadRequestException("Failed to retrieve post");
    }
  }

  async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
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
  // async updateManyPosts(
  //   ids: string[],
  //   updateData: Partial<Post>
  // ): Promise<{ matchedCount: number; modifiedCount: number }> {
  //   try {
  //     const result = await this.postModel
  //       .updateMany(
  //         { _id: { $in: ids } },
  //         { $set: updateData },
  //         { multi: true }
  //       )
  //       .exec();
  //     if (result.matchedCount === 0) {
  //       throw new NotFoundException("No posts found to update");
  //     }
  //     return {
  //       matchedCount: result.matchedCount,
  //       modifiedCount: result.modifiedCount,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException("Failed to update posts");
  //   }
  // }

  // async removeManyPosts(ids: string[]): Promise<{ deletedCount: number }> {
  //   try {
  //     const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

  //     if (validIds.length === 0) {
  //       throw new BadRequestException(
  //         "No valid ObjectIds provided for deletion"
  //       );
  //     }
  //     const result = await this.postModel
  //       .deleteMany({ id: { $in: validIds } })
  //       .exec();

  //     if (result.deletedCount === 0) {
  //       throw new NotFoundException("No posts found to delete");
  //     }

  //     return { deletedCount: result.deletedCount };
  //   } catch (error) {
  //     throw new BadRequestException("Failed to delete posts");
  //   }
  // }
}
