import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UpdatePostDto } from "./update-post.dto";

export class BulkUpdatePostsDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  ids: string[];

  @ValidateNested()
  @Type(() => UpdatePostDto)
  updateData: UpdatePostDto;
}
