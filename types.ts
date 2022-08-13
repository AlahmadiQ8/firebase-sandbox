import { User } from "firebase/auth";
import { FieldValue } from "firebase/firestore";

// TODO: User strong typing
export interface IUserContext {
  user: User | null, 
  username: any,
}

export interface IFireStoreUser {
  username: string,
  photoURL: string,
  displayName: string,
}

export interface IPost {
  content: string,
  slug: string, 
  title: string, 
  published: boolean,
  username: string,
  heartCount: number
  createdAt: number | FieldValue,
  updatedAt: number | FieldValue,
  uid: string,
}
