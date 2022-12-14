import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { IPost } from '../types';

export function PostContent({post}: {post: IPost}) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : (post.createdAt as Timestamp).toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{' '}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}
