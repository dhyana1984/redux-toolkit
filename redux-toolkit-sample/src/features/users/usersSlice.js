import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const userAdapter = createEntityAdapter()

// const initialState = []
const initialState = userAdapter.getInitialState()

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await client.get('fakeApi/users')
    return response.users
})

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    // extraReducers: {
    //     [fetchUsers.fulfilled]: (state, action) => {
    //         return action.payload
    //     }
    // }
    extraReducers: {
        [fetchUsers.fulfilled]: userAdapter.setAll
    }
})

export default userSlice.reducer

// export const selectAllUsers = state => state.users

// export const selectUserById = (state, userId) => state.users.find(user => user.id === userId)

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById
} = userAdapter.getSelectors(state => state.users)