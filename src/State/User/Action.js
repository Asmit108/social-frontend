import { API_BASE_URL, api } from "../../config/apiConfig";
import {
    CHANGE_USER_ROLE_FAILURE, CHANGE_USER_ROLE_REQUEST, CHANGE_USER_ROLE_SUCCESS,
    DELETE_ADMIN_USER_FAILURE, DELETE_ADMIN_USER_REQUEST, DELETE_ADMIN_USER_SUCCESS,
    DELETE_USER_FAILURE, DELETE_USER_REQUEST, DELETE_USER_SUCCESS,
    FIND_ALL_USERS_FAILURE, FIND_ALL_USERS_REQUEST, FIND_ALL_USERS_SUCCESS,
    FIND_OWN_PROFILE_FAILURE, FIND_OWN_PROFILE_REQUEST, FIND_OWN_PROFILE_SUCCESS,
    FIND_USER_FAILURE, FIND_USER_REQUEST, FIND_USER_SUCCESS,
    FOLLOW_USER_FAILURE, FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS,
    SEARCH_USERS_FAILURE, SEARCH_USERS_REQUEST, SEARCH_USERS_SUCCESS,
    UPDATE_USER_FAILURE, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS
} from "./ActionType";

const findAllUsersRequest = () => ({ type: FIND_ALL_USERS_REQUEST });
const findAllUsersSuccess = (users) => ({ type: FIND_ALL_USERS_SUCCESS, payload: users });
const findAllUsersFailure = (error) => ({ type: FIND_ALL_USERS_FAILURE, payload: error });

export const findAllUsers = () => async (dispatch) => {
    dispatch(findAllUsersRequest());
    try {
        const response = await api.get(`${API_BASE_URL}users`);
        dispatch(findAllUsersSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(findAllUsersFailure(error.message));
        return { success: false, error: error.message };
    }
};

const findUserRequest = () => ({ type: FIND_USER_REQUEST });
const findUserSuccess = (user) => ({ type: FIND_USER_SUCCESS, payload: user });
const findUserFailure = (error) => ({ type: FIND_USER_FAILURE, payload: error });

export const findUserById = (userId) => async (dispatch) => {
    dispatch(findUserRequest());
    try {
        const response = await api.get(`${API_BASE_URL}users/${userId}`);
        dispatch(findUserSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(findUserFailure(error.message));
        return { success: false, error: error.message };
    }
};

const updateUserRequest = () => ({ type: UPDATE_USER_REQUEST });
const updateUserSuccess = (user) => ({ type: UPDATE_USER_SUCCESS, payload: user });
const updateUserFailure = (error) => ({ type: UPDATE_USER_FAILURE, payload: error });

export const updateUser = (userData) => async (dispatch) => {
    dispatch(updateUserRequest());
    try {
        const response = await api.put(`${API_BASE_URL}users`, userData);
        dispatch(updateUserSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(updateUserFailure(error.message));
        return { success: false, error: error.message };
    }
};

const deleteUserRequest = () => ({ type: DELETE_USER_REQUEST });
const deleteUserSuccess = (response) => ({ type: DELETE_USER_SUCCESS, payload: response });
const deleteUserFailure = (error) => ({ type: DELETE_USER_FAILURE, payload: error });

export const deleteUser = () => async (dispatch) => {
    dispatch(deleteUserRequest());
    try {
        const response = await api.delete(`${API_BASE_URL}users`);
        dispatch(deleteUserSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(deleteUserFailure(error.message));
        return { success: false, error: error.message };
    }
};

const followUserRequest = () => ({ type: FOLLOW_USER_REQUEST });
const followUserSuccess = (user) => ({ type: FOLLOW_USER_SUCCESS, payload: user });
const followUserFailure = (error) => ({ type: FOLLOW_USER_FAILURE, payload: error });

export const followUser = (userId) => async (dispatch) => {
    dispatch(followUserRequest());
    try {
        const response = await api.put(`${API_BASE_URL}users/follow/${userId}`);
        dispatch(followUserSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(followUserFailure(error.message));
        return { success: false, error: error.message };
    }
};

const searchUsersRequest = () => ({ type: SEARCH_USERS_REQUEST });
const searchUsersSuccess = (users) => ({ type: SEARCH_USERS_SUCCESS, payload: users });
const searchUsersFailure = (error) => ({ type: SEARCH_USERS_FAILURE, payload: error });

export const searchUsers = (query) => async (dispatch) => {
    dispatch(searchUsersRequest());
    try {
        const response = await api.get(`${API_BASE_URL}users/search`, { params: { query } });
        dispatch(searchUsersSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(searchUsersFailure(error.message));
        return { success: false, error: error.message };
    }
};

const findOwnProfileRequest = () => ({ type: FIND_OWN_PROFILE_REQUEST });
const findOwnProfileSuccess = (profile) => ({ type: FIND_OWN_PROFILE_SUCCESS, payload: profile });
const findOwnProfileFailure = (error) => ({ type: FIND_OWN_PROFILE_FAILURE, payload: error });

export const findOwnProfile = () => async (dispatch) => {
    dispatch(findOwnProfileRequest());
    try {
        const response = await api.get(`${API_BASE_URL}users/profile`);
        console.log("Fetched own profile:", response.data);
        dispatch(findOwnProfileSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(findOwnProfileFailure(error.message));
        return { success: false, error: error.message };
    }
};

const deleteAdminUserRequest = () => ({ type: DELETE_ADMIN_USER_REQUEST });
const deleteAdminUserSuccess = (response) => ({ type: DELETE_ADMIN_USER_SUCCESS, payload: response });
const deleteAdminUserFailure = (error) => ({ type: DELETE_ADMIN_USER_FAILURE, payload: error });

export const deleteAdminUser = (userId) => async (dispatch) => {
    dispatch(deleteAdminUserRequest());
    try {
        const response = await api.delete(`${API_BASE_URL}admin/users/${userId}`);
        dispatch(deleteAdminUserSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(deleteAdminUserFailure(error.message));
        return { success: false, error: error.message };
    }
};

const changeUserRoleRequest = () => ({ type: CHANGE_USER_ROLE_REQUEST });
const changeUserRoleSuccess = (user) => ({ type: CHANGE_USER_ROLE_SUCCESS, payload: user });
const changeUserRoleFailure = (error) => ({ type: CHANGE_USER_ROLE_FAILURE, payload: error });

export const changeUserRole = (userId, newRole) => async (dispatch) => {
    dispatch(changeUserRoleRequest());
    try {
        const response = await api.put(`${API_BASE_URL}admin/users/${userId}`, null, { params: { newRole } });
        dispatch(changeUserRoleSuccess(response.data));
        return { success: true, data: response.data };
    } catch (error) {
        dispatch(changeUserRoleFailure(error.message));
        return { success: false, error: error.message };
    }
};