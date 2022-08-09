import { ParsedUrlQuery } from "querystring";
import { GetStaticPaths, GetStaticProps } from "next"
import { collectionGroup, doc, getDoc, getDocs, query } from "firebase/firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { PostContent } from '../../components/PostContent';
import { db, getUserWithUsername, serializePost } from "../../lib/firebase";
import { IPost } from "../../types";
import styles from '../../styles/Post.module.css';

interface IParams extends ParsedUrlQuery {
  username: string,
  slug: string
}

export default function PostPage(props: { post: IPost, path: string }) {
  const postRef = doc(db, props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = (realtimePost || props.post) as IPost;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

      </aside>
    </main>
  )
}


export const getStaticProps: GetStaticProps<{ post: IPost, path: string }, IParams> = async (context) => {
  const { username, slug } = context.params!;
  const user = (await getUserWithUsername(username)).docs[0];
  const postRef = doc(user.ref, `posts/${slug}`)
  const post = serializePost(await getDoc(postRef));
  const path = postRef.path

  return {
    props: { post, path },
    revalidate: 5000
  }
}


export const getStaticPaths: GetStaticPaths = async () => {
  // TODO: Improve my using Admin SDK to select empty docs
  const postsSnapshot = await getDocs(query(collectionGroup(db, 'posts')))
  const paths = postsSnapshot.docs.map(doc => {
    const { slug, username } = doc.data() as IParams;

    return { params: { username, slug } }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}
