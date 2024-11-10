import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema } from "./schemas/post.schema";
import { ImageSchema } from "./schemas/image.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Post", schema: PostSchema },
      { name: "Image", schema: ImageSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
