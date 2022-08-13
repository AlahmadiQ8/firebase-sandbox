import { doc, DocumentData, DocumentReference, increment, writeBatch } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../lib/firebase";

export function HeartButton({postRef}: {postRef: DocumentReference<DocumentData>}) {
  const heartRef = doc(postRef, `hearts/${auth.currentUser!.uid}`);
  const [heartDoc] = useDocument(heartRef);

  const addHeart = async () => {
    const uid = auth.currentUser!.uid;
    const batch = writeBatch(db);

    batch.update(postRef, {heartCount: increment(1) });
    batch.set(heartRef, {uid});

    await batch.commit();
  };

  const removeHeart =async () => {
    const batch = writeBatch(db);

    batch.update(postRef, { heartCount: increment(-1)});
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
