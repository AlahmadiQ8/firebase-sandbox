import type { GetServerSideProps, NextPage } from 'next';
import { Loader } from '../components/Loader';
import { IPost } from '../types';
import { useState } from 'react';
import { collectionGroup, getDocs, limit, orderBy, query, startAfter, startAt, where } from 'firebase/firestore';
import { db, fromMillis, serializePost } from '../lib/firebase';
import { PostFeed } from '../components/PostFeed';
import {Metatags} from '../components/Metatags';

const BATCH_SIZE = 1;

const postsQueryAll = query(
  collectionGroup(db, 'posts'),
  where('published', '==', true),
  orderBy('createdAt', 'desc')
);

const Home: NextPage<{ posts: IPost[] }> = (props) => {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);

    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const postsQuery = query(
      postsQueryAll,
      startAfter(cursor),
      limit(BATCH_SIZE),
    );

    const newPosts = (await getDocs(postsQuery)).docs.map((d) => d.data()) as IPost[];
    
    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < BATCH_SIZE) {
      setPostsEnd(true);
    }
  };
  
  return (
    <main>
      <Metatags title='Home Page' description='tring this metatags component' />
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postsQuery = query(
    postsQueryAll,
    limit(BATCH_SIZE)
  );

  const postsSnapshot = await getDocs(postsQuery);
  const posts = postsSnapshot.docs.map(serializePost);

  return {
    props: { posts } // will be passed to the page component as props
  };
};

export default Home;

