import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { ReactionButton } from './ReactionButton'
import { TimeAgo } from './TimeAgo'

export const PostsList = () => {
    const posts = useSelector(state => state.posts)
    //To order the posts, posts.slice() is to get a copy of state to with out mutate the state
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

    const renderedPosts = orderedPosts.map(post => (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
                <ReactionButton post={post} />
            </div>
            <p className="post-content">{post.content.substring(0, 10)}</p>
            <Link to={`/posts/${post.id}`} className="button muted-button">
                view Post
            </Link>
        </article>
    ))

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {renderedPosts}
        </section>
    )
}