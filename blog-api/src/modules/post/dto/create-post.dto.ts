import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
  @ApiProperty({ description: "The title of the post" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Base64 string of the featured image",
    required: false,
  })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiProperty({ description: "Short description of the post" })
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @ApiProperty({
    description: "Base64 string of the main banner image",
    required: false,
  })
  @IsString()
  @IsOptional()
  mainImage?: string;

  @ApiProperty({ description: "Full content of the post" })
  @IsString()
  @IsNotEmpty()
  articleContent: string;
}
