import {
    CHANGE_USER_ROLE_FAILURE,
    CHANGE_USER_ROLE_REQUEST,
    CHANGE_USER_ROLE_SUCCESS,
    DELETE_ADMIN_USER_FAILURE,
    DELETE_ADMIN_USER_REQUEST,
    DELETE_ADMIN_USER_SUCCESS,
    DELETE_USER_FAILURE,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    FIND_ALL_USERS_FAILURE,
    FIND_ALL_USERS_REQUEST,
    FIND_ALL_USERS_SUCCESS,
    FIND_OWN_PROFILE_FAILURE,
    FIND_OWN_PROFILE_REQUEST,
    FIND_OWN_PROFILE_SUCCESS,
    FIND_USER_FAILURE,
    FIND_USER_REQUEST,
    FIND_USER_SUCCESS,
    FOLLOW_USER_FAILURE,
    FOLLOW_USER_REQUEST,
    FOLLOW_USER_SUCCESS,
    SEARCH_USERS_FAILURE,
    SEARCH_USERS_REQUEST,
    SEARCH_USERS_SUCCESS,
    UPDATE_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
} from './ActionType';

const initialState = {
    isLoading: false,
    error: null,
    users: [],
    user: null,
    profile: null
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FIND_ALL_USERS_REQUEST:
        case FIND_USER_REQUEST:
        case UPDATE_USER_REQUEST:
        case DELETE_USER_REQUEST:
        case FOLLOW_USER_REQUEST:
        case SEARCH_USERS_REQUEST:
        case FIND_OWN_PROFILE_REQUEST:
        case DELETE_ADMIN_USER_REQUEST:
        case CHANGE_USER_ROLE_REQUEST:
            return { ...state, isLoading: true};

        case FIND_ALL_USERS_SUCCESS:
            return { ...state, isLoading: false, users: action.payload };
        case FIND_USER_SUCCESS:
            return { ...state, isLoading: false, user: action.payload };
        case UPDATE_USER_SUCCESS:
        case FOLLOW_USER_SUCCESS:
        case CHANGE_USER_ROLE_SUCCESS:
            return { ...state, isLoading: false, user: action.payload, profile: action.payload };
        case SEARCH_USERS_SUCCESS:
            return { ...state, isLoading: false, searchedUsers: action.payload };
        case FIND_OWN_PROFILE_SUCCESS:
            return { ...state, isLoading: false, profile: action.payload };
        case DELETE_USER_SUCCESS:
        case DELETE_ADMIN_USER_SUCCESS:
            return { ...state, isLoading: false };

        case FIND_ALL_USERS_FAILURE:
        case FIND_USER_FAILURE:
        case UPDATE_USER_FAILURE:
        case DELETE_USER_FAILURE:
        case FOLLOW_USER_FAILURE:
        case SEARCH_USERS_FAILURE:
        case FIND_OWN_PROFILE_FAILURE:
        case DELETE_ADMIN_USER_FAILURE:
        case CHANGE_USER_ROLE_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state;
    }
};