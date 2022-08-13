import { collection, doc, getDoc, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { FormEventHandler, useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from 'lodash/kebabCase';
import toast from "react-hot-toast";
import { AuthCheck } from "../../components/AuthCheck";
import { PostFeed } from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { auth, db } from "../../lib/firebase";
import { IPost } from "../../types";
import styles from '../../styles/Admin.module.css';

export default function AdminPostsPage({ }) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const postsRef = collection(db, `users/${auth.currentUser!.uid}/posts`);
  const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
  const [postsSnapshot] = useCollection(postsQuery);
  const posts = postsSnapshot?.docs.map(d => d.data()) as IPost[] ?? [];

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  // Ensure slug is URL safe
  // TODO: Invesitage URL encoding for Arabic
  const slug = kebabCase(title);

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  const createPost: FormEventHandler = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser!.uid;
    const newPostRef = doc(db, `users/${uid}/posts`, slug);
    if ((await getDoc(newPostRef)).exists()) {
      toast.error('Post with the same title already exists');
      return;
    }

    const data: IPost = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# Hello omg',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(newPostRef, data);

    toast.success('Post created!');

    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
