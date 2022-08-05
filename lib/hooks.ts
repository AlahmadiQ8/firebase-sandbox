import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore"; 
import { IUserContext } from '../types'

export function useUserData(): IUserContext {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe; 

    if (user) {
      const userRef = doc(db, 'users', user.uid)
      unsubscribe = onSnapshot(userRef, doc => {
        setUsername(doc.data()?.username)
      })
    } else {
      setUsername(null);
    }

    return unsubscribe
  }, [user])

  return {user, username}
}
