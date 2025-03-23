import { Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  image: string;
}
