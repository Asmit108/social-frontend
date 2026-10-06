import { applyMiddleware, combineReducers, legacy_createStore } from "redux"
import { thunk } from "redux-thunk"
import { authReducer } from "./Auth/Reducer"
import { postReducer } from "./Post/Reducer"
import { commentReducer } from "./Comment/Reducer"
import { chatReducer } from "./Chat/Reducer"
import { messageReducer } from "./Message/Reducer"
import { userReducer } from "./User/Reducer"

const rootReducers = combineReducers({
   auth: authReducer,
   post: postReducer,
   comment: commentReducer,
   chat: chatReducer,
   message: messageReducer,
   user: userReducer
})

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk))