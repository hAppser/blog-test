import { ApiProperty } from "@nestjs/swagger";

export class PostDto {
  @ApiProperty({ description: "Title of the post" })
  title: string;

  @ApiProperty({ description: "Featured image URL", required: false })
  featuredImage: string | null;

  @ApiProperty({ description: "Short description of the post" })
  shortDescription: string;

  @ApiProperty({ description: "Main image URL", required: false })
  mainImage: string | null;

  @ApiProperty({ description: "Content of the post article" })
  articleContent: string;

  @ApiProperty({ description: "Creation date of the post", required: false })
  createdAt?: Date;

  @ApiProperty({ description: "Last update date of the post", required: false })
  updatedAt?: Date;
}
