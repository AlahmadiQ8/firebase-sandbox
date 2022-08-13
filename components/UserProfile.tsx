import Image from "next/image";
import { IFireStoreUser } from "../types";

export function UserProfile({ user }: { user: IFireStoreUser}) {
  return (
    <div className="">
      <Image src={user.photoURL} alt="Profile Picture" width={200} height={200} className="card-img-center" />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || 'Anonymous User'}</h1>
    </div>
  );
}
