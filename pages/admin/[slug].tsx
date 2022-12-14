import { doc, DocumentData, DocumentReference, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { AuthCheck } from "../../components/AuthCheck";
import { ImageUploader } from "../../components/ImageUploader";
import { auth, db } from "../../lib/firebase";
import styles from '../../styles/Admin.module.css';
import { IPost } from "../../types";

export default function AdminPostPage({ }) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;
  const postRef = doc(db, `users/${auth.currentUser!.uid}/posts/${slug}`);
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post as IPost} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }: { defaultValues: IPost, postRef: DocumentReference<DocumentData>, preview: boolean }) {
  const { register, handleSubmit, reset, watch, formState: { isValid, isDirty, errors } } = useForm({ defaultValues, mode: 'onChange' });

  const updatePost = async ({ content, published }: { content: string, published: boolean }) => {
    await updateDoc(postRef, { content, published, updatedAt: serverTimestamp() });
    reset({ content, published });
    toast.success('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>

        <ImageUploader />

        <textarea {...register('content', {
          maxLength: { value: 20000, message: 'content is too long' },
          minLength: { value: 10, message: 'content is too short' },
          required: { value: true, message: 'content is required'}
        })}></textarea>

        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        <fieldset>
          <input className={styles.checkbox} type="checkbox" {...register('published')} />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  );
}
