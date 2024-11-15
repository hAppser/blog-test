import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post as PostModelDto } from "./interfaces/post.interface";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PostDto } from "./dto/post-dto";
import { BulkUpdatePostsDto } from "./dto/bulk-update-posts.dto";

@Controller("posts")
@ApiTags("Posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: "Create a new post" })
  @ApiResponse({
    status: 201,
    description: "The post has been successfully created.",
  })
  @ApiBadRequestResponse({ description: "Failed to create post" })
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all posts" })
  @ApiResponse({ status: 200, description: "Returns all posts" })
  @ApiBadRequestResponse({ description: "Failed to retrieve posts" })
  async findAllPosts(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    return this.postService.findAllPosts(page, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a post by ID" })
  @ApiResponse({ status: 200, description: "The post details" })
  @ApiNotFoundResponse({ description: "Post not found" })
  @ApiBadRequestResponse({ description: "Failed to retrieve post" })
  findPostById(@Param("id") id: string) {
    return this.postService.findPostById(id);
  }

  @Get("title/:title")
  @ApiOperation({ summary: "Get a post by Title" })
  @ApiResponse({ status: 200, description: "The post details" })
  @ApiNotFoundResponse({ description: "Post not found" })
  @ApiBadRequestResponse({ description: "Failed to retrieve post" })
  async findPostByTitle(
    @Param("title") title: string
  ): Promise<PostModelDto | null> {
    return this.postService.findPostByTitle(title);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a post by ID" })
  @ApiBody({
    description: "Data to update the post",
    type: UpdatePostDto,
  })
  @ApiResponse({ status: 200, description: "The updated post details" })
  @ApiNotFoundResponse({ description: "Post with the given ID not found" })
  @ApiBadRequestResponse({ description: "Failed to retrieve post" })
  updatePost(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove post by ID" })
  @ApiResponse({
    status: 200,
    description: "The removed post",
    type: PostDto,
  })
  @ApiNotFoundResponse({
    description: "Post with the given ID not found",
  })
  @ApiNotFoundResponse({ description: "Post with the given ID not found" })
  removePost(@Param("id") id: string): Promise<PostModelDto | null> {
    return this.postService.removePost(id);
  }

  @Post("bulk-delete")
  @ApiOperation({ summary: "Remove several posts by IDs" })
  @ApiBody({
    description: "Array of Posts ID",
    type: [String],
    examples: {
      "application/json": {
        value: ["60d21b4667d0d8992e610c85", "60d21b4667d0d8992e610c86"],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Count of deleted posts",
    schema: {
      type: "object",
      properties: {
        deletedCount: {
          type: "number",
          example: 3,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Post with the given ID not found",
  })
  @ApiNotFoundResponse({ description: "Post with the given ID not found" })
  async deleteMany(@Body("ids") ids: string[]) {
    return this.postService.bulkRemovePosts(ids);
  }
}
