import { API_BASE_URL, api } from "../../config/apiConfig";
import {
    CREATE_COMMENT_FAILURE, CREATE_COMMENT_REQUEST, CREATE_COMMENT_SUCCESS,
    DELETE_ADMIN_COMMENT_FAILURE, DELETE_ADMIN_COMMENT_REQUEST, DELETE_ADMIN_COMMENT_SUCCESS,
    DELETE_COMMENT_FAILURE, DELETE_COMMENT_REQUEST, DELETE_COMMENT_SUCCESS,
    FIND_COMMENTS_BY_POST_FAILURE, FIND_COMMENTS_BY_POST_REQUEST, FIND_COMMENTS_BY_POST_SUCCESS,
    LIKE_COMMENT_FAILURE, LIKE_COMMENT_REQUEST, LIKE_COMMENT_SUCCESS
} from "./ActionType";

const createCommentRequest = () => ({ type: CREATE_COMMENT_REQUEST });
const createCommentSuccess = (comment) => ({ type: CREATE_COMMENT_SUCCESS, payload: comment });
const createCommentFailure = (error) => ({ type: CREATE_COMMENT_FAILURE, payload: error });

export const createComment = (comment, postId) => async (dispatch) => {
    dispatch(createCommentRequest());
    try {
        const response = await api.post(`${API_BASE_URL}comments/post/${postId}`, comment);
        dispatch(createCommentSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(createCommentFailure(error.message));
        return { success: false, error: error.message };
    }
};

const findCommentsByPostRequest = () => ({ type: FIND_COMMENTS_BY_POST_REQUEST });
const findCommentsByPostSuccess = (comments) => ({ type: FIND_COMMENTS_BY_POST_SUCCESS, payload: comments });
const findCommentsByPostFailure = (error) => ({ type: FIND_COMMENTS_BY_POST_FAILURE, payload: error });

export const findCommentsByPostId = (postId) => async (dispatch) => {
    dispatch(findCommentsByPostRequest());
    try {
        const response = await api.get(`${API_BASE_URL}comments/post/${postId}`);
        dispatch(findCommentsByPostSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(findCommentsByPostFailure(error.message));
        return { success: false, error: error.message };
    }
};

const likeCommentRequest = () => ({ type: LIKE_COMMENT_REQUEST });
const likeCommentSuccess = (comment) => ({ type: LIKE_COMMENT_SUCCESS, payload: comment });
const likeCommentFailure = (error) => ({ type: LIKE_COMMENT_FAILURE, payload: error });

export const likeComment = (commentId) => async (dispatch) => {
    dispatch(likeCommentRequest());
    try {
        const response = await api.put(`${API_BASE_URL}comments/like/${commentId}`);
        dispatch(likeCommentSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(likeCommentFailure(error.message));
        return { success: false, error: error.message };
    }
};

const deleteAdminCommentRequest = () => ({ type: DELETE_ADMIN_COMMENT_REQUEST });
const deleteAdminCommentSuccess = (response) => ({ type: DELETE_ADMIN_COMMENT_SUCCESS, payload: response });
const deleteAdminCommentFailure = (error) => ({ type: DELETE_ADMIN_COMMENT_FAILURE, payload: error });

export const deleteAdminComment = (commentId) => async (dispatch) => {
    dispatch(deleteAdminCommentRequest());
    try {
        const response = await api.delete(`${API_BASE_URL}admin/comments/${commentId}`);
        dispatch(deleteAdminCommentSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(deleteAdminCommentFailure(error.message));
        return { success: false, error: error.message };
    }
};

const deleteCommentRequest = () => ({ type: DELETE_COMMENT_REQUEST });
const deleteCommentSuccess = (response) => ({ type: DELETE_COMMENT_SUCCESS, payload: response });
const deleteCommentFailure = (error) => ({ type: DELETE_COMMENT_FAILURE, payload: error });

export const deleteComment = (commentId) => async (dispatch) => {
    dispatch(deleteCommentRequest());
    try {
        const response = await api.delete(`${API_BASE_URL}comments/${commentId}`);
        dispatch(deleteCommentSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(deleteCommentFailure(error.message));
        return { success: false, error: error.message };
    }
};