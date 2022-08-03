import { signInWithPopup, signOut } from "firebase/auth"
import Image from "next/image"
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth, googleProvider } from "../lib/firebase"

export default function EnterPage({ }) {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {user ? 
        !username ? <UsernameForm /> : <SignOutButton /> 
        : 
        <SignInButton />
      }
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <Image alt="Sign in with Google" src="/google.png" width={40} height={40} /> Sign in with Google
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => signOut(auth)}>Sign Out</button>;
}

function UsernameForm() {
  return null;
}
