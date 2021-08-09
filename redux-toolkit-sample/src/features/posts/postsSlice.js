import { createAsyncThunk, createSlice, current, nanoid } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const initialState = {
    posts: [],
    status: 'idle',
    error: null
}

/*
createAsyncThunk accepts two arguments:
A string that will be used as the prefix for the generated action types
A "payload creator" callback function that should return a Promise containing some data, or a rejected Promise with an error
*/
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const response = await client.get('/fakeApi/posts')
        return response.posts
    })

export const addNewPost = createAsyncThunk(
    'post/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async initialPost => {
        // We send the initial data to the fake API server
        const response = await client.post('fakeApi/posts', { post: initialPost })
        // The response includes the complete post object, including unique ID
        return response.post
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            // initial the payload callback function
            //we call the creator with out object as parameter, just pass in the single parameters as prepare
            prepare(title, content, userId) {
                return {
                    //here will return payload object with single parameter from action creator
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        userId
                    }
                }
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = state.posts.find(post => post.id === id)
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        },
    },
    //Here are the thunk promise behavior in different status
    extraReducers: {
        //Please note that there wouldn't return any value
        [fetchPosts.pending]: (state, action) => { state.status = 'loading' },
        [fetchPosts.fulfilled]: (state, action) => {
            //state here is a proxy object, need to use current function to display in browser
            console.log(current(state))
            state.status = 'succeeded'
            state.posts = state.posts.concat(action.payload)
            console.log(current(state))
        },
        [fetchPosts.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
        [addNewPost.fulfilled]: (state, action) => {
            // We can directly add the new post to posts array
            state.posts.push(action.payload)
        }
    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)