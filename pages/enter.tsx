import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import Image from "next/image";
import { useCallback, useContext, useEffect, useState } from "react";
import debounce from 'lodash/debounce';
import { UserContext } from "../lib/context";
import { auth, db, googleProvider } from "../lib/firebase";
import { registerVersion } from "firebase/app";

export default function EnterPage() {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {/* <Metatags title="Enter" description="Sign up for this amazing app!" /> */}
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

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
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userRef = doc(db, 'users', user!.uid);
    const usernameRef = doc(db, 'usernames', formValue);

    const batch = writeBatch(db);
    batch.set(userRef, { username: formValue, photoURL: user!.photoURL ?? null, displayName: user!.displayName });
    batch.set(usernameRef, { uid: user!.uid });
    await batch.commit();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force form valu e typed in form to match correct format
    const val = e.target.value;
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        const ref = doc(db, 'usernames', username);
        const usernameDoc = await getDoc(ref);
        console.log("Firestore read executed!");
        setIsValid(!usernameDoc.exists());
        setLoading(false);
      }
    }, 500)
    , []);

  if (username) return null;

  return (
    <section>
      <h3>Choose Username</h3>
      <form onSubmit={onSubmit}>
        <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
        <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
        <button type="submit" className="btn-green" disabled={!isValid}>
          Choose
        </button>

        <h3>Debug State</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username Valid: {isValid.toString()}
        </div>
      </form>
    </section>
  );
}

function UsernameMessage({ username, isValid, loading }: { username: string, isValid: boolean, loading: boolean }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }

}
