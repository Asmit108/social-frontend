import { API_BASE_URL, api } from "../../config/apiConfig";
import {
    CREATE_MESSAGE_FAILURE, CREATE_MESSAGE_REQUEST, CREATE_MESSAGE_SUCCESS,
    DELETE_ADMIN_MESSAGE_FAILURE, DELETE_ADMIN_MESSAGE_REQUEST, DELETE_ADMIN_MESSAGE_SUCCESS,
    FIND_CHAT_MESSAGES_FAILURE, FIND_CHAT_MESSAGES_REQUEST, FIND_CHAT_MESSAGES_SUCCESS
} from "./ActionType";

const createMessageRequest = () => ({ type: CREATE_MESSAGE_REQUEST });
const createMessageSuccess = (message) => ({ type: CREATE_MESSAGE_SUCCESS, payload: message });
const createMessageFailure = (error) => ({ type: CREATE_MESSAGE_FAILURE, payload: error });

export const createMessage = (message, chatId) => async (dispatch) => {
    dispatch(createMessageRequest());
    try {
        const response = await api.post(`${API_BASE_URL}messages/chat/${chatId}`, message);
        dispatch(createMessageSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(createMessageFailure(error.message));
        return { success: false, error: error.message };
    }
};

const findChatMessagesRequest = () => ({ type: FIND_CHAT_MESSAGES_REQUEST });
const findChatMessagesSuccess = (messages) => ({ type: FIND_CHAT_MESSAGES_SUCCESS, payload: messages });
const findChatMessagesFailure = (error) => ({ type: FIND_CHAT_MESSAGES_FAILURE, payload: error });

export const findChatMessages = (chatId) => async (dispatch) => {
    dispatch(findChatMessagesRequest());
    try {
        const response = await api.get(`${API_BASE_URL}messages/chat/${chatId}`);
        dispatch(findChatMessagesSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(findChatMessagesFailure(error.message));
        return { success: false, error: error.message };
    }
};

const deleteAdminMessageRequest = () => ({ type: DELETE_ADMIN_MESSAGE_REQUEST });
const deleteAdminMessageSuccess = (response) => ({ type: DELETE_ADMIN_MESSAGE_SUCCESS, payload: response });
const deleteAdminMessageFailure = (error) => ({ type: DELETE_ADMIN_MESSAGE_FAILURE, payload: error });

export const deleteAdminMessage = (messageId) => async (dispatch) => {
    dispatch(deleteAdminMessageRequest());
    try {
        const response = await api.delete(`${API_BASE_URL}admin/messages/${messageId}`);
        dispatch(deleteAdminMessageSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(deleteAdminMessageFailure(error.message));
        return { success: false, error: error.message };
    }
};
