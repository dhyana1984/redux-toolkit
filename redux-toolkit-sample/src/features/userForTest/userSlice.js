import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { userAPI } from './userAPI'
import { client } from '../../api/client'

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await client.get('fakeApi/users')
    return response.users
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: 'No user',
        status: 'idle'
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchUser.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.status = 'complete'
            state.name = action.payload
        })
    }
})

export const selectUser = state => state.user.name
export const selectUserFetchStatus = state => state.user.status

export default userSlice.reducer