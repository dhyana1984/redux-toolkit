import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { fetchPosts, selectPostById, selectPostIds } from './postsSlice'
import { ReactionButton } from './ReactionButton'
import { TimeAgo } from './TimeAgo'

const PostExcerpt = ({ postId }) => {
    //pass postId here and find the post in the entites
    const post = useSelector(state => selectPostById(state, postId))
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
}

export const PostsList = () => {
    const dispatch = useDispatch()
    // const posts = useSelector(selectAllPosts)
    const orderdPostIds = useSelector(selectPostIds)

    const postStatus = useSelector(state => state.posts.status)
    const error = useSelector(state => state.posts.error)

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    let content
    if (postStatus === 'loading') {
        content = <div className='loader'>Loading...</div>
    } else if (postStatus === 'succeeded') {
        //To order the posts, posts.slice() is to get a copy of state to with out mutate the state
        // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        content = orderdPostIds.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
        ))
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}