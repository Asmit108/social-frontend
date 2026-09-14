import { API_BASE_URL, api } from "../../config/apiConfig";
import {LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType";

const registerRequest = () => ({ type: REGISTER_REQUEST })
const registerSuccess = (jwt, role) => ({ type: REGISTER_SUCCESS, payload: { jwt, role } })
const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error })

export const register = (userData) => async (dispatch) => {
    dispatch(registerRequest())

    try {
        const response = await api.post(`${API_BASE_URL}auth/signup`, userData)
        console.log(response);
        const jwt = response.data.token;
        const role = response.data.role;
        if (jwt && role) {
            localStorage.setItem("jwt", jwt)
            localStorage.setItem("role", role)
        }

        dispatch(registerSuccess(jwt, role));
        return { success: true, data: response.data }
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Login failed';
        dispatch(registerFailure(error.message));
        return { success: false, error: message }
    }
}

const loginRequest = () => ({ type: LOGIN_REQUEST })
const loginSuccess = (jwt, role) => ({ type: LOGIN_SUCCESS, payload: { jwt, role } })
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error })

export const login = (userData) => async (dispatch) => {
    console.log("login");
    dispatch(loginRequest())
    try {
        const response = await api.post(`${API_BASE_URL}auth/signin`, userData)
        const jwt = response.data.token;
        const role = response.data.role;
        if (jwt && role) {
            console.log("Storing JWT and role in localStorage:", jwt, role);
            localStorage.setItem("jwt", jwt)
            localStorage.setItem("role", role)
        }
        dispatch(loginSuccess(jwt, role))
        return { success: true, data: response.data }
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Login failed';
        dispatch(loginFailure(message))
        return { success: false, error: message }
    }
}

export const logout = () => async (dispatch) => {
    try {
        dispatch({ type: LOGOUT, payload: null });
        localStorage.clear();
        return { success: true };
    } catch (error) {
        dispatch({ type: LOGOUT, payload: null });
        localStorage.clear();
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Logout failed'
        };
    }
}
