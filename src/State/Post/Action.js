import { API_BASE_URL, api } from "../../config/apiConfig";
import {
    CREATE_POST_FAILURE, CREATE_POST_REQUEST, CREATE_POST_SUCCESS,
    DELETE_ADMIN_POST_FAILURE, DELETE_ADMIN_POST_REQUEST, DELETE_ADMIN_POST_SUCCESS,
    DELETE_POST_FAILURE, DELETE_POST_REQUEST, DELETE_POST_SUCCESS,
    FIND_ALL_POSTS_FAILURE, FIND_ALL_POSTS_REQUEST, FIND_ALL_POSTS_SUCCESS,
    FIND_TOP_POSTS_FAILURE, FIND_TOP_POSTS_REQUEST, FIND_TOP_POSTS_SUCCESS,
    FIND_USER_POSTS_FAILURE, FIND_USER_POSTS_REQUEST, FIND_USER_POSTS_SUCCESS,
    LIKE_POST_FAILURE, LIKE_POST_REQUEST, LIKE_POST_SUCCESS,
    SAVE_POST_FAILURE, SAVE_POST_REQUEST, SAVE_POST_SUCCESS
} from "./ActionType";

const createPostRequest = () => ({ type: CREATE_POST_REQUEST });
const createPostSuccess = (post) => ({ type: CREATE_POST_SUCCESS, payload: post });
const createPostFailure = (error) => ({ type: CREATE_POST_FAILURE, payload: error });

export const createPost = (postData) => async (dispatch) => {
    dispatch(createPostRequest());
    try {
        const response = await api.post(`${API_BASE_URL}posts/user`, postData);
        dispatch(createPostSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(createPostFailure(error.message));
        return { success: false, error: error.message };
    }
};

const deletePostRequest = () => ({ type: DELETE_POST_REQUEST });
const deletePostSuccess = (response) => ({ type: DELETE_POST_SUCCESS, payload: response });
const deletePostFailure = (error) => ({ type: DELETE_POST_FAILURE, payload: error });

export const deletePost = (postId) => async (dispatch) => {
    dispatch(deletePostRequest());
    try {
        const response = await api.delete(`${API_BASE_URL}posts/${postId}`);
        dispatch(deletePostSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(deletePostFailure(error.message));
        return { success: false, error: message };
    }
};

const findUserPostsRequest = () => ({ type: FIND_USER_POSTS_REQUEST });
const findUserPostsSuccess = (posts) => ({ type: FIND_USER_POSTS_SUCCESS, payload: posts });
const findUserPostsFailure = (error) => ({ type: FIND_USER_POSTS_FAILURE, payload: error });

export const findUserPosts = (userId) => async (dispatch) => {
    dispatch(findUserPostsRequest());
    try {
        const response = await api.get(`${API_BASE_URL}posts/user/${userId}`);
        dispatch(findUserPostsSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(findUserPostsFailure(error.message));
        return { success: false, error: error.message };
    }
};

const findAllPostsRequest = () => ({ type: FIND_ALL_POSTS_REQUEST });
const findAllPostsSuccess = (posts) => ({ type: FIND_ALL_POSTS_SUCCESS, payload: posts });
const findAllPostsFailure = (error) => ({ type: FIND_ALL_POSTS_FAILURE, payload: error });

export const findAllPosts = () => async (dispatch) => {
    dispatch(findAllPostsRequest());
    try {
        const response = await api.get(`${API_BASE_URL}posts`);
        dispatch(findAllPostsSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Login failed';
        dispatch(findAllPostsFailure(error.message));
        return { success: false, error: error.message };
    }
};

const savePostRequest = () => ({ type: SAVE_POST_REQUEST });
const savePostSuccess = (post) => ({ type: SAVE_POST_SUCCESS, payload: post });
const savePostFailure = (error) => ({ type: SAVE_POST_FAILURE, payload: error });

export const savePost = (postId) => async (dispatch) => {
    dispatch(savePostRequest());
    try {
        const response = await api.put(`${API_BASE_URL}posts/${postId}`);
        dispatch(savePostSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(savePostFailure(error.message));
        return { success: false, error: message };
    }
};

const likePostRequest = () => ({ type: LIKE_POST_REQUEST });
const likePostSuccess = (post) => ({ type: LIKE_POST_SUCCESS, payload: post });
const likePostFailure = (error) => ({ type: LIKE_POST_FAILURE, payload: error });

export const likePost = (postId) => async (dispatch) => {
    dispatch(likePostRequest());
    try {
        const response = await api.put(`${API_BASE_URL}posts/like/${postId}`);
        dispatch(likePostSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(likePostFailure(error.message));
        return { success: false, error: error.message };
    }
};

const findTopPostsRequest = () => ({ type: FIND_TOP_POSTS_REQUEST });
const findTopPostsSuccess = (posts) => ({ type: FIND_TOP_POSTS_SUCCESS, payload: posts });
const findTopPostsFailure = (error) => ({ type: FIND_TOP_POSTS_FAILURE, payload: error });

export const findTopPosts = () => async (dispatch) => {
    dispatch(findTopPostsRequest());
    try {
        const response = await api.get(`${API_BASE_URL}posts/top`);
        dispatch(findTopPostsSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(findTopPostsFailure(error.message));
        return { success: false, error: error.message };
    }
};

const deleteAdminPostRequest = () => ({ type: DELETE_ADMIN_POST_REQUEST });
const deleteAdminPostSuccess = (response) => ({ type: DELETE_ADMIN_POST_SUCCESS, payload: response });
const deleteAdminPostFailure = (error) => ({ type: DELETE_ADMIN_POST_FAILURE, payload: error });

export const deleteAdminPost = (postId) => async (dispatch) => {
    dispatch(deleteAdminPostRequest());
    try {
        const response = await api.delete(`${API_BASE_URL}admin/posts/${postId}`);
        dispatch(deleteAdminPostSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(deleteAdminPostFailure(error.message));
        return { success: false, error: error.message };
    }
};