import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, nanoid } from '@reduxjs/toolkit'
import { client } from '../../api/client'

//createEntityAdapter accepts an options object that may include a sortComparer function
//which will be used to keep the item IDs array in sorted order by comparing two items
const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

//getInitialState() returns an empty {ids: [], entities: {}} normalized state object
const initialState = postsAdapter.getInitialState({
    // posts: [],
    status: 'idle',
    error: null
})

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
            // const existingPost = state.posts.find(post => post.id === postId)
            const existingPost = state.entities[postId]
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
            // const existingPost = state.posts.find(post => post.id === id)
            const existingPost = state.entities[id]
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
            // console.log(current(state))
            state.status = 'succeeded'
            // state.posts = state.posts.concat(action.payload)

            // Use the `upsertMany` reducer as a mutating update ulility
            // If there's any items in action.payload that already existing in our state
            //the upsertMany function will merge them together based on matching IDs.
            postsAdapter.upsertMany(state, action.payload)
        },
        [fetchPosts.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
        [addNewPost.fulfilled]: (state, action) => {
            // We can directly add the new post to posts array
            // state.posts.push(action.payload)
            postAdded.addOne(state, action)
        }
    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// export const selectAllPosts = state => state.posts.posts

// export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)

// Export the customized selectors for this adapter using `getSelectors`
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds

} = postsAdapter.getSelectors(state => state.posts)

export const selectPostsByUser = createSelector(
    //input selector, re-use selectAllPosts
    [selectAllPosts, (state, userId) => userId],
    //output selector, only when posts or userid changed, this selector will re-run
    (posts, userId) => posts.filter(post => post.user === userId)
)

/* Example for selectPostsByUser output selector

    const state1 = getState()
    // Output selector runs, because it's the first call
    selectPostsByUser(state1, 'user1')
    // Output selector does _not_ run, because the arguments haven't changed
    selectPostsByUser(state1, 'user1')
    // Output selector runs, because `userId` changed
    selectPostsByUser(state1, 'user2')

    dispatch(reactionAdded())
    const state2 = getState()
    // Output selector does not run, because `posts` and `userId` are the same
    selectPostsByUser(state2, 'user2')

    // Add some more posts
    dispatch(addNewPost())
    const state3 = getState()
    // Output selector runs, because `posts` has changed
    selectPostsByUser(state3, 'user2')

 */