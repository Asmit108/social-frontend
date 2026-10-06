import { API_BASE_URL, api } from "../../config/apiConfig";
import {
    CREATE_CHAT_FAILURE, CREATE_CHAT_REQUEST, CREATE_CHAT_SUCCESS,
    DELETE_ADMIN_CHAT_FAILURE, DELETE_ADMIN_CHAT_REQUEST, DELETE_ADMIN_CHAT_SUCCESS,
    DELETE_CHAT_FAILURE, DELETE_CHAT_REQUEST, DELETE_CHAT_SUCCESS,
    FIND_ALL_CHATS_FAILURE, FIND_ALL_CHATS_REQUEST, FIND_ALL_CHATS_SUCCESS,
    FIND_USER_CHATS_FAILURE, FIND_USER_CHATS_REQUEST, FIND_USER_CHATS_SUCCESS
} from "./ActionType";

const createChatRequest = () => ({ type: CREATE_CHAT_REQUEST });
const createChatSuccess = (chat) => ({ type: CREATE_CHAT_SUCCESS, payload: chat });
const createChatFailure = (error) => ({ type: CREATE_CHAT_FAILURE, payload: error });

export const createChat = (userId) => async (dispatch) => {
    dispatch(createChatRequest());
    try {
        const response = await api.post(`${API_BASE_URL}chats`, { userId });
        dispatch(createChatSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(createChatFailure(error.message));
        return { success: false, error: error.message };
    }
};

const findUserChatsRequest = () => ({ type: FIND_USER_CHATS_REQUEST });
const findUserChatsSuccess = (chats) => ({ type: FIND_USER_CHATS_SUCCESS, payload: chats });
const findUserChatsFailure = (error) => ({ type: FIND_USER_CHATS_FAILURE, payload: error });

export const findUserChats = () => async (dispatch) => {
    dispatch(findUserChatsRequest());
    try {
        const response = await api.get(`${API_BASE_URL}chats`);
        dispatch(findUserChatsSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(findUserChatsFailure(error.message));
        return { success: false, error: error.message };
    }
};

const findAllChatsRequest = () => ({ type: FIND_ALL_CHATS_REQUEST });
const findAllChatsSuccess = (chats) => ({ type: FIND_ALL_CHATS_SUCCESS, payload: chats });
const findAllChatsFailure = (error) => ({ type: FIND_ALL_CHATS_FAILURE, payload: error });

export const findAllChats = () => async (dispatch) => {
    dispatch(findAllChatsRequest());
    try {
        const response = await api.get(`${API_BASE_URL}admin/chats`);
        dispatch(findAllChatsSuccess(response.data));
        console.log("All chats fetched successfully:", response.data);
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(findAllChatsFailure(error.message));
        console.log("Error fetching all chats:", error.message);
        return { success: false, error: error.message };
    }
};

const deleteOwnChatRequest = () => ({ type: DELETE_CHAT_REQUEST });
const deleteOwnChatSuccess = (response) => ({ type: DELETE_CHAT_SUCCESS, payload: response });
const deleteOwnChatFailure = (error) => ({ type: DELETE_CHAT_FAILURE, payload: error });

export const deleteOwnChat = (chatId) => async (dispatch) => {
    dispatch(deleteOwnChatRequest());
    try {
        const response = await api.delete(`${API_BASE_URL}chats/${chatId}`);
        dispatch(deleteOwnChatSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(deleteOwnChatFailure(error.message));
        return { success: false, error: error.message };
    }
};

const deleteChatRequest = () => ({ type: DELETE_ADMIN_CHAT_REQUEST });
const deleteChatSuccess = (response) => ({ type: DELETE_ADMIN_CHAT_SUCCESS, payload: response });
const deleteChatFailure = (error) => ({ type: DELETE_ADMIN_CHAT_FAILURE, payload: error });

export const deleteChat = (chatId) => async (dispatch) => {
    dispatch(deleteChatRequest());
    try {
        const response = await api.delete(`${API_BASE_URL}admin/chats/${chatId}`);
        dispatch(deleteChatSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(deleteChatFailure(error.message));
        return { success: false, error: error.message };
    }
};

export const deleteAdminChat = deleteChat;