import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Post, ImageDocumet } from "./interfaces/post.interface";
import { ClientSession, Model, Types } from "mongoose";

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

  private createImages(
    postData: CreatePostDto | UpdatePostDto,
    postId: string,
    session: ClientSession
  ) {
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

  async findAllPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: Post[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const total = await this.postModel.countDocuments();

      const posts = await this.postModel.find().skip(skip).limit(limit).exec();

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

      return {
        posts: postsWithImages,
        total,
      };
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
        featuredImage: featuredImage?.data || null,
        mainImage: mainImage?.data || null,
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
    const session = await this.postModel.db.startSession();
    session.startTransaction();

    try {
      const existingPost = await this.postModel.findById(id).exec();
      if (!existingPost) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      const oldImages = {
        mainImage: existingPost.mainImage,
        featuredImage: existingPost.featuredImage,
      };

      const updatedPost = await this.postModel
        .findByIdAndUpdate(
          id,
          {
            title: postData.title,
            shortDescription: postData.shortDescription,
            articleContent: postData.articleContent,
          },
          { new: true, session }
        )
        .exec();

      await this.replaceOldImages(oldImages, postData, id);

      const imagesToSave = this.createImages(postData, updatedPost.id, session);

      await Promise.all(imagesToSave);

      await session.commitTransaction();
      return updatedPost;
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException("Failed to update post with images");
    } finally {
      session.endSession();
    }
  }

  async replaceOldImages(
    oldImages: { mainImage?: string; featuredImage?: string },
    postData: UpdatePostDto,
    postId: string
  ) {
    if (postData?.mainImage !== oldImages.mainImage) {
      await this.imageModel.updateOne(
        { postId, type: "main" },
        { $set: { data: postData.mainImage } }
      );
    } else if (!postData.mainImage && oldImages.mainImage) {
      await this.postModel.updateOne(
        { postId, type: "main" },
        { $unset: { mainImage: 1 } }
      );
    }

    if (
      postData.featuredImage &&
      postData.featuredImage !== oldImages.featuredImage
    ) {
      await this.postModel.updateOne(
        { postId, type: "featured" },
        { $set: { featuredImage: postData.featuredImage } }
      );
    } else if (!postData.featuredImage && oldImages.featuredImage) {
      await this.postModel.updateOne(
        { postId, type: "featured" },
        { $unset: { featuredImage: 1 } }
      );
    }
  }

  async removePost(id: string): Promise<Post> {
    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
    if (!deletedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return deletedPost;
  }

  async bulkUpdatePosts(
    updates: { id: string; title?: string; description?: string }[]
  ): Promise<Post[]> {
    try {
      let matchedCount = 0;

      const result = Promise.all(
        updates.map(async (update) => {
          const { id, ...updateData } = update;
          return await this.updatePost(update.id, update);
        })
      );

      if (matchedCount === 0) {
        throw new NotFoundException("No posts found to update");
      }

      return result;
    } catch (error) {
      throw new BadRequestException("Failed to update posts");
    }
  }

  async bulkRemovePosts(ids: string[]): Promise<{ deletedCount: number }> {
    try {
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));
      const result = await this.postModel
        .deleteMany({ _id: { $in: validIds } })
        .exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException("No posts found to delete");
      }

      return { deletedCount: result.deletedCount };
    } catch (error) {
      throw new BadRequestException("Failed to delete posts");
    }
  }
}
