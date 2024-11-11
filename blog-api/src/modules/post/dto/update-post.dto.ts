import { PartialType } from "@nestjs/mapped-types";
import { CreatePostDto } from "./create-post.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ description: "The title of the post", required: true })
  @IsString()
  id: string;

  @ApiProperty({ description: "The title of the post", required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "Base64 string of the featured image",
    required: false,
  })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiProperty({
    description: "Short description of the post",
    required: false,
  })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({
    description: "Base64 string of the main banner image",
    required: false,
  })
  @IsString()
  @IsOptional()
  mainImage?: string;

  @ApiProperty({ description: "Full content of the post", required: false })
  @IsString()
  @IsOptional()
  articleContent?: string;
}
