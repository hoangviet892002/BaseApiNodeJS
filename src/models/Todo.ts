import { Document, Model, Schema, model } from "mongoose";

export interface ITodo extends Document {
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Completed */
  completed: boolean;
  /** Created On */
  createdOn: Date;
  /** Updated On */
  updatedOn: Date;
  /** User ID */
  userId: string;
}
interface ITodoModel extends Model<ITodo> {}
const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
  createdOn: {
    required: true,
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    required: true,
    type: Date,
    default: Date.now,
  },
  userId: { type: String, required: true },
});
export const Todo: ITodoModel = model<ITodo, ITodoModel>("Todo", schema);
