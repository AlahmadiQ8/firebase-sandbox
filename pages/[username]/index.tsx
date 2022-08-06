import { limit, query, where, orderBy, getDocs, collection } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { PostFeed } from "../../components/PostFeed";
import { UserProfile } from "../../components/UserProfile";
import { db, getUserWithUsername, serializePost } from "../../lib/firebase";
import { IFireStoreUser, IPost } from "../../types";

export default function UserProfilePage({ user, posts }: { user: IFireStoreUser, posts: IPost[] }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query: urlQuery }) => {
  const { username } = urlQuery;

  const userSnapshot = await getUserWithUsername(username as string);
  const id = userSnapshot.docs[0].id;
  const user = userSnapshot.docs[0].data() as IFireStoreUser;
  
  const postsQuery = query(
    collection(db, `users/${id}/posts`),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(5)
  )

  const postsSnapshot = await getDocs(postsQuery);
  postsSnapshot.forEach(doc => console.log(doc.data()));

  const posts = postsSnapshot.docs.map(serializePost);

  return {
    props: { user, posts },
  };
}
