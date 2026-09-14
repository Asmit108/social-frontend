import {
    CREATE_CHAT_FAILURE,
    CREATE_CHAT_REQUEST,
    CREATE_CHAT_SUCCESS,
    DELETE_ADMIN_CHAT_FAILURE,
    DELETE_ADMIN_CHAT_REQUEST,
    DELETE_ADMIN_CHAT_SUCCESS,
    DELETE_CHAT_FAILURE,
    DELETE_CHAT_REQUEST,
    DELETE_CHAT_SUCCESS,
    FIND_ALL_CHATS_FAILURE,
    FIND_ALL_CHATS_REQUEST,
    FIND_ALL_CHATS_SUCCESS,
    FIND_USER_CHATS_FAILURE,
    FIND_USER_CHATS_REQUEST,
    FIND_USER_CHATS_SUCCESS,
} from './ActionType';

const initialState = {
    isLoading: false,
    error: null,
    chat: null,
    userChats: [],
    allChats: [],
};

export const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_CHAT_REQUEST:
        case FIND_USER_CHATS_REQUEST:
        case FIND_ALL_CHATS_REQUEST:
        case DELETE_ADMIN_CHAT_REQUEST:
        case DELETE_CHAT_REQUEST:
            return { ...state, isLoading: true};

        case CREATE_CHAT_SUCCESS:
            return { ...state, isLoading: false, chat: action.payload };

        case FIND_USER_CHATS_SUCCESS:
            return { ...state, isLoading: false, userChats: action.payload };

        case FIND_ALL_CHATS_SUCCESS:
            return { ...state, isLoading: false, allChats: action.payload };

        case DELETE_ADMIN_CHAT_SUCCESS:
        case DELETE_CHAT_SUCCESS:
            return { ...state, isLoading: false};

        case CREATE_CHAT_FAILURE:
        case FIND_USER_CHATS_FAILURE:
        case FIND_ALL_CHATS_FAILURE:
        case DELETE_ADMIN_CHAT_FAILURE:
        case DELETE_CHAT_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        default:
            return state;
    }
};