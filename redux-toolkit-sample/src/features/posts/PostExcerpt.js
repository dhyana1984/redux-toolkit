import React from 'react'
import { ReactionButton } from './ReactionButton'
import { TimeAgo } from './TimeAgo'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'

//Use React.memo to make sure the sub component will not recursively render
export const PostExcerpt = React.memo(({ post }) => {
    const renderedPosts = (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 10)}</p>
            <ReactionButton post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                view Post
            </Link>
        </article>
    )

    return renderedPosts
})