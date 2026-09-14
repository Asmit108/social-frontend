import {
    CREATE_MESSAGE_FAILURE,
    CREATE_MESSAGE_REQUEST,
    CREATE_MESSAGE_SUCCESS,
    DELETE_ADMIN_MESSAGE_FAILURE,
    DELETE_ADMIN_MESSAGE_REQUEST,
    DELETE_ADMIN_MESSAGE_SUCCESS,
    FIND_CHAT_MESSAGES_FAILURE,
    FIND_CHAT_MESSAGES_REQUEST,
    FIND_CHAT_MESSAGES_SUCCESS,
} from './ActionType';

const initialState = {
    isLoading: false,
    error: null,
    message: null,
    messages: [],
};

export const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_MESSAGE_REQUEST:
        case FIND_CHAT_MESSAGES_REQUEST:
        case DELETE_ADMIN_MESSAGE_REQUEST:
            return { ...state, isLoading: true };

        case CREATE_MESSAGE_SUCCESS:
            return { ...state, isLoading: false, message: action.payload };

        case FIND_CHAT_MESSAGES_SUCCESS:
            return { ...state, isLoading: false, messages: action.payload };

        case DELETE_ADMIN_MESSAGE_SUCCESS:
            return { ...state, isLoading: false };

        case CREATE_MESSAGE_FAILURE:
        case FIND_CHAT_MESSAGES_FAILURE:
        case DELETE_ADMIN_MESSAGE_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        default:
            return state;
    }
};
