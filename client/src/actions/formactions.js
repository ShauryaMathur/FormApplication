import {ADD_ITEM} from './types';


export const getDepartmentPendingFormsSocket = (socket, data) => dispatch => {

    socket.emit('getDepartmentPendingForms', data);

};

export const getRequestedFormsSocket = (socket, data) => dispatch => {
    socket.emit('getRequestedFormsSocket', data);
}


export const addFormSocket = (socket, form) => (dispatch, getState) => {

    socket.emit('addForm', form)
};

export const FormAdded = (data) => (dispatch) => {
    dispatch({type: ADD_ITEM, payload: data})

}

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

