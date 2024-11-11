import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UpdatePostDto } from "./update-post.dto";

export class BulkUpdatePostsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePostDto)
  updates: UpdatePostDto[];
}
