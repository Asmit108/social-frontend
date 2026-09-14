import {
    CREATE_COMMENT_FAILURE,
    CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS,
    DELETE_ADMIN_COMMENT_FAILURE,
    DELETE_ADMIN_COMMENT_REQUEST,
    DELETE_ADMIN_COMMENT_SUCCESS,
    DELETE_COMMENT_FAILURE,
    DELETE_COMMENT_REQUEST,
    DELETE_COMMENT_SUCCESS,
    FIND_COMMENTS_BY_POST_FAILURE,
    FIND_COMMENTS_BY_POST_REQUEST,
    FIND_COMMENTS_BY_POST_SUCCESS,
    LIKE_COMMENT_FAILURE,
    LIKE_COMMENT_REQUEST,
    LIKE_COMMENT_SUCCESS,
} from './ActionType';

const initialState = {
    isLoading: false,
    error: null,
    comment: null,
    comments: []
};

export const commentReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_COMMENT_REQUEST:
        case FIND_COMMENTS_BY_POST_REQUEST:
        case LIKE_COMMENT_REQUEST:
        case DELETE_ADMIN_COMMENT_REQUEST:
        case DELETE_COMMENT_REQUEST:
            return { ...state, isLoading: true};

        case CREATE_COMMENT_SUCCESS:
        case LIKE_COMMENT_SUCCESS:
            return { ...state, isLoading: false, comment: action.payload };

        case FIND_COMMENTS_BY_POST_SUCCESS:
            return { ...state, isLoading: false, comments: action.payload };

        case DELETE_ADMIN_COMMENT_SUCCESS:
        case DELETE_COMMENT_SUCCESS:
            return { ...state, isLoading: false};

        case CREATE_COMMENT_FAILURE:
        case FIND_COMMENTS_BY_POST_FAILURE:
        case LIKE_COMMENT_FAILURE:
        case DELETE_ADMIN_COMMENT_FAILURE:
        case DELETE_COMMENT_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        default:
            return state;
    }
};