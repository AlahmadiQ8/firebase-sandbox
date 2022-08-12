import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "../lib/context";

export function AuthCheck(props: {children: React.ReactNode, fallback?: any}) {
  const { username } = useContext(UserContext);

  return username ? props.children : props.fallback || <Link href="/enter">You must be signed in</Link>;
}
