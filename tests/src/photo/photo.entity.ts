import type { ObjectID } from "bson";
export interface Photo {
  _id: ObjectID;

  name: string;

  description: string;

  filename: string;

  views: number;

  isPublished: boolean;
}
