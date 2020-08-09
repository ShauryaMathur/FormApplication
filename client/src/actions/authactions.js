import axios from 'axios';
import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    USER_LOADING,
    USER_LOADED
} from './types';

// Check token and load user
export const loadUser = () => (dispatch, getState) => { // User Loading
    dispatch({type: USER_LOADING});

    axios.get('/api/auth/user', tokenConfig(getState)).then(res => dispatch({type: USER_LOADED, payload: res.data})).catch(err => {
        console.log(err);
    });
};

// Register User
export const register = ({name, email, password, department}) => dispatch => { // Header
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    // Request Body
    const body = JSON.stringify({name, email, password, department});


    axios.post('/api/users', body, config).then(res => dispatch({type: REGISTER_SUCCESS, payload: res.data})).catch(err => {
        console.log(err);

    });
};


// Setup config/header and token
export const tokenConfig = getState => { // Get Token from LocalStorage

    const token = getState().auth.token;

    // Headers

    const config = {
        headers: {
            "Content-type": "application/json"
        }

    }

    // If token,add to headers
    if (token) {
        config.headers['x-auth-token'] = token;
    }

    return config;
};

// Login User

export const login = ({email, password}) => dispatch => { // Header
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    // Request Body
    const body = JSON.stringify({email, password});

    axios.post('/api/auth', body, config).then(res => dispatch({type: LOGIN_SUCCESS, payload: res.data})).catch(err => {
        console.log(err);

    });
};


// Logout User
export const logout = () => {
    return {type: LOGOUT_SUCCESS};
};

export const getAllUsersSocket = (socket) => ()=>{
    socket.emit('getAllUsers')
}

export const getAllDepartmentsSocket = (socket) => () => {

    socket.emit('getAllDepartmentsSocket')

}

