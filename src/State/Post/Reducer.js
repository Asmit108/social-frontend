import {
    CREATE_POST_FAILURE,
    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    DELETE_ADMIN_POST_FAILURE,
    DELETE_ADMIN_POST_REQUEST,
    DELETE_ADMIN_POST_SUCCESS,
    DELETE_POST_FAILURE,
    DELETE_POST_REQUEST,
    DELETE_POST_SUCCESS,
    FIND_ALL_POSTS_FAILURE,
    FIND_ALL_POSTS_REQUEST,
    FIND_ALL_POSTS_SUCCESS,
    FIND_POST_FAILURE,
    FIND_POST_REQUEST,
    FIND_POST_SUCCESS,
    FIND_TOP_POSTS_FAILURE,
    FIND_TOP_POSTS_REQUEST,
    FIND_TOP_POSTS_SUCCESS,
    FIND_USER_POSTS_FAILURE,
    FIND_USER_POSTS_REQUEST,
    FIND_USER_POSTS_SUCCESS,
    LIKE_POST_FAILURE,
    LIKE_POST_REQUEST,
    LIKE_POST_SUCCESS,
    SAVE_POST_FAILURE,
    SAVE_POST_REQUEST,
    SAVE_POST_SUCCESS,
} from './ActionType';

const initialState = {
    isLoading: false,
    error: null,
    posts: [],
    userPosts: [],
    topPosts: [],
    post: null
};

export const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_POST_REQUEST:
        case DELETE_POST_REQUEST:
        case FIND_POST_REQUEST:
        case FIND_USER_POSTS_REQUEST:
        case FIND_ALL_POSTS_REQUEST:
        case SAVE_POST_REQUEST:
        case LIKE_POST_REQUEST:
        case FIND_TOP_POSTS_REQUEST:
        case DELETE_ADMIN_POST_REQUEST:
            return { ...state, isLoading: true, error: null };

        case CREATE_POST_SUCCESS:
        case SAVE_POST_SUCCESS:
        case LIKE_POST_SUCCESS:
            return { ...state, isLoading: false, error: null, post: action.payload };

        case FIND_USER_POSTS_SUCCESS:
            return { ...state, isLoading: false, error: null, userPosts: action.payload };

        case FIND_ALL_POSTS_SUCCESS:
            return { ...state, isLoading: false, error: null, posts: action.payload };

        case FIND_TOP_POSTS_SUCCESS:
            return { ...state, isLoading: false, error: null, topPosts: action.payload };

        case DELETE_POST_SUCCESS:
        case DELETE_ADMIN_POST_SUCCESS:
            return { ...state, isLoading: false, error: null};

        case CREATE_POST_FAILURE:
        case DELETE_POST_FAILURE:
        case FIND_POST_FAILURE:
        case FIND_USER_POSTS_FAILURE:
        case FIND_ALL_POSTS_FAILURE:
        case SAVE_POST_FAILURE:
        case LIKE_POST_FAILURE:
        case FIND_TOP_POSTS_FAILURE:
        case DELETE_ADMIN_POST_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        default:
            return state;
    }
};