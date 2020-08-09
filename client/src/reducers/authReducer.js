import {USER_LOADED,USER_LOADING,AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL,LOGOUT_SUCCESS,REGISTER_SUCCESS,REGISTER_FAIL} from '../actions/types';
import io from 'socket.io-client';


const initialState={
    token:localStorage.getItem('token'),
    department:localStorage.getItem('department'),
    isAuthenticated:null,
    isLoading:false,
    user:null,
    email:localStorage.getItem('email'),
    socket:io.connect("https://switchon-formapplication.herokuapp.com")
};

export default function(state=initialState,action){
    switch(action.type){
        case USER_LOADING:
            return{
                ...state,
                isLoading:true
            };
        case USER_LOADED:
            return{
                ...state,
                isAuthenticated:true,
                isLoading:false,
                user:action.payload
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token',action.payload.token);
            localStorage.setItem('department',action.payload.user.department);
            localStorage.setItem('email',action.payload.user.email)
            return{
                ...state,
                ...action.payload,
                department : action.payload.user.department,
                email:action.payload.user.email,
                isAuthenticated:true,
                isLoading:false
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            localStorage.removeItem('department');
            localStorage.removeItem('email')
            return{
                ...state,
                token:null,
                user:null,
                department:null,
                email:null,
                isAuthenticated:false,
                isLoading:false

            };
        default:
            return state;

    }
}