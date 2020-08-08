import {ITEMS_LOADING, GET_ITEMS, ADD_ITEM, DELETE_ITEM} from './types';
import axios from 'axios';
import {tokenConfig} from './authactions';
import {returnErrors} from './erroractions';

export const getDepartmentPendingFormsSocket = (socket, data) => dispatch => {

    socket.emit('getDepartmentPendingForms', data);

};

export const getRequestedFormsSocket = (socket, data) => dispatch => {
    socket.emit('getRequestedFormsSocket', data);
}


export const deleteItem = id => (dispatch, getState) => {
    axios.delete(`/api/items/${id}`, tokenConfig(getState)).then(res => dispatch({type: DELETE_ITEM, payload: id})).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));;
};

export const addFormSocket = (socket, form) => (dispatch, getState) => {

    socket.emit('addForm', form)
};

export const FormAdded = (data) => (dispatch) => {
    dispatch({type: ADD_ITEM, payload: data})

}

export const setItemsLoading = () => {
    return {type: ITEMS_LOADING};
};

export const approveForm = (socket, id) => (dispatch) => {
    socket.emit('approveForm', id);
}

export const rejectForm = (socket, id) => (dispatch) => {
    socket.emit('rejectForm', id);
}

export const getApprovedFormsSocket = (socket, data) => (dispatch) => {
    socket.emit('getApprovedFormsSocket',data);

}

export const getRejectedFormsSocket = (socket, data) => (dispatch) => {
    socket.emit('getRejectedFormsSocket', data);

}

