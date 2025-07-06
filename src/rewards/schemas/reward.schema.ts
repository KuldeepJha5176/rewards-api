import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true, default: 0 })
  totalPoints!: number;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
