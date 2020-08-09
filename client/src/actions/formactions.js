export const getDepartmentPendingFormsSocket = (socket, data) => dispatch => {

    socket.emit('getDepartmentPendingForms', data);

};

export const getRequestedFormsSocket = (socket, data) => dispatch => {
    socket.emit('getRequestedFormsSocket', data);
}


export const addFormSocket = (socket, form) => (dispatch, getState) => {

    socket.emit('addForm', form)
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

