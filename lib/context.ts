import { createContext } from "react";

// TODO: User strong typing
export interface CurrentUser {
  user: any, 
  username: any,
}

export const UserContext = createContext<CurrentUser>({user: null, username: null})
