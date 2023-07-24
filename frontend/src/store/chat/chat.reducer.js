import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const initialState = {
    chatId: null,
    messages: [],
    allChats: [],
    isLoading: false,
    isAllChatsLoading: false,
    error: null
}

const getMessageResponse = createAsyncThunk("chat/getMessageResponse", async (query, {rejectWithValue, getState}) => {
    try {
        const chatId = getState().chat.chatId
        const response = await axiosInstance.post('/chat/query', { query, chatId })
        return response.data.response.data
    }
    catch (error) {
        return rejectWithValue(error.response.data.response)
    }
    
})

const getAllChats = createAsyncThunk("chat/all", async (_, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.get('/chat/all')
        const chats = response.data.response.data.chats.map(chat => {
            return {chatId: chat.chatId}
        })
        return chats
    }
    catch (error) {
        return rejectWithValue(error.response.data.response)
    }
})

const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload) // under the hood, immer is used to make this immutable
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMessageResponse.pending, (state) => {
            state.isLoading = true
            state.success = false
        })
        builder.addCase(getMessageResponse.fulfilled, (state, action) => {
            state.chatId = action.payload.chatId
            state.messages.push(action.payload.queryRes)
            state.allChats = [{chatId: action.payload.chatId}, ...state.allChats]
            state.isLoading = false
        })
        builder.addCase(getMessageResponse.rejected, (state, action) => {
            state.error = action.payload
            state.messages.push({role:"assistant", text: "Sorry, something went wrong. Please try again later."})
            state.isLoading = false
        })
        // getAllChats
        builder.addCase(getAllChats.pending, (state) => {
            state.isAllChatsLoading = true
            state.success = false
        })
        builder.addCase(getAllChats.fulfilled, (state, action) => {
            state.allChats = action.payload
            state.isAllChatsLoading = false
        })
        builder.addCase(getAllChats.rejected, (state, action) => {
            state.error = action.payload
            state.isAllChatsLoading = false
        })
    }
})

export const { addMessage } = chatSlice.actions
export { getMessageResponse, getAllChats }
export const chatReducer = chatSlice.reducer    