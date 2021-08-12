import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersSlice'
import { selectPostsByUser } from '../posts/postsSlice'
import { Link } from 'react-router-dom'

export const UserPage = ({ match }) => {
    const { userId } = match.params
    const user = useSelector(state => selectUserById(state, userId))
    // const postForUser = useSelector(state => {
    //     const allPosts = selectAllPosts(state)
    //     //every time any action was dispatched, the useSelector will re-run
    //     //here return a new array in useSelector, so the component will re-render every time when action dispatch
    //     return allPosts.filter(post => post.user === userId)
    // })

    //Here use the selectPostsByUser which is create by CreateSelector
    //It's a memoized selectors only when state or userId changed, selectPostsByUser will re-run
    const postForUser = useSelector(state => selectPostsByUser(state, userId))

    const postTitles = postForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ))

    return (
        <section>
            <h2>{user?.name}</h2>
            <ul>{postTitles}</ul>
        </section>
    )
}