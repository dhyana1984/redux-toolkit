import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor';
import { selectPostById } from './postsSlice';
import { ReactionButton } from './ReactionButton';
import { TimeAgo } from './TimeAgo';

export const SinglePostPage = ({ match }) => {
    const { postId } = match.params
    const post = useSelector(state => selectPostById(state, postId))

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    return (
        <section>
            <article className='post'>
                <h2>{post.title}</h2>
                <div>
                    <PostAuthor userId={post.user} />
                    <TimeAgo timestamp={post.date} />
                </div>
                <p className="post-content">{post.content}</p>
                <ReactionButton post={post} />
                <Link to={`/editPost/${postId}`} className="button">
                    Edit Post
                </Link>
            </article>
        </section>
    )
}