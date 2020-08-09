const express = require('express');
const router = express.Router();

// Form Model
const Form = require('../../models/Form');
const User = require('../../models/User')

// @route GET api/forms
// @desc  Get All Forms
// @acess Public
router.get('/', (req, res) => {

    Form.find().sort({date: -1}).then(items => res.json(items)).catch(console.error);
});


const addForm = (req) => {
    User.findOne({name: req.targetUser, department: req.departmentName}).then(user => {

        const newForm = new Form({
            createdBy: req.createdBy,
            departmentName: req.departmentName,
            targetUser: req.targetUser,
            message: req.message,
            status: 'Assigned',
            targetUserEmail: user.email
        });

        newForm.save().then(form => console.log(form)).catch(err => console.log(err));

    })


}

const getDepartmentPendingForms = (socket, req) => {
    console.log(req)
    Form.find({departmentName: req.departmentName, status: 'Assigned'}).limit(5).sort({creation_date: -1}).then(forms => {

        socket.emit('departmentFormsFetched', forms)
    }).catch(err => console.log(err));


}

const getRequestedFormsSocket = (socket, req) => {
    console.log('getRequestedFormsSocket' + req.targetUser)

    Form.find({targetUserEmail: req.targetUser, status: 'Assigned'}).limit(5).sort({creation_date: -1}).then(forms => {

        socket.emit('requestedFormsFetched', forms)
    }).catch(err => console.log(err))

}

const getApprovedFormsSocket = (socket, req) => {
    Form.find({targetUserEmail: req.targetUser, status: 'Approved'}).limit(5).sort({creation_date: -1}).then(forms => {

        socket.emit('approvedFormsFetched', forms)
    }).catch(err => console.log(err))

}

const getRejectedFormsSocket = (socket, req) => {
    Form.find({targetUserEmail: req.targetUser, status: 'Rejected'}).limit(5).sort({creation_date: -1}).then(forms => {

        socket.emit('rejectedFormsFetched', forms)
    }).catch(err => console.log(err))

}


const approveForm = (io,socket, id) => {
    Form.findByIdAndUpdate(id, {status: 'Approved'}).then(form => {
        socket.emit('formApproved', form);
        io.emit('formApproved',form)
    })

}

const rejectForm = (io,socket, id) => {

    Form.findByIdAndUpdate(id, {status: 'Rejected'}).then(form => {
        socket.emit('formRejected', form);
        io.emit('formRejected',form)
    })
}

const getAllUsers = (socket) => {
    User.find().then(users => {
        socket.emit('allUsersFetched', users);
    })
}

const getAllDepartments = (socket) =>{
    User.find().distinct("department").then(departments=>{
        socket.emit('allDepartmentsFetched',departments)
    })
}



module.exports = {
    addForm: addForm,
    getDepartmentPendingForms: getDepartmentPendingForms,
    getRequestedFormsSocket: getRequestedFormsSocket,
    approveForm: approveForm,
    rejectForm: rejectForm,
    getApprovedFormsSocket:getApprovedFormsSocket,
    getRejectedFormsSocket:getRejectedFormsSocket,
    getAllUsers : getAllUsers,
    getAllDepartments : getAllDepartments

}
