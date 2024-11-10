import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Types } from "mongoose";

@Schema()
export class Image extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: "Post" })
  postId: Types.ObjectId;

  @Prop({ required: true })
  data: string;

  @Prop({ required: true })
  type: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
