const express = require('express');
const auth = require('../../Middleware/auth');
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

// @route POST api/forms
// @desc  Create A Form
// @acess Private
router.post('/', auth, (req, res) => {

    const newForm = new Form({
        createdBy: req.body.createdBy,
        departmentName: req.body.departmentName,
        targetUser: req.body.targetUser,
        message: req.body.message,
        status: 'Assigned'
    });

    newForm.save().then(form => res.json(form)).catch(err => console.log(err));
});

const addForm = (req) => {
    var targetUserEmail = '';
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


const approveForm = (socket, id) => {
    Form.findByIdAndUpdate(id, {status: 'Approved'}).then(form => {
        socket.emit('formApproved', form)
    })

}

const rejectForm = (socket, id) => {

    Form.findByIdAndUpdate(id, {status: 'Rejected'}).then(form => {
        socket.emit('formRejected', form)
    })


}

// @route DELETE api/forms/:id
// @desc  Delete A Form
// @acess Private
router.delete('/:id', auth, (req, res) => {

    Item.findById(req.params.id).then(item => item.remove().then(() => res.json({success: true}))).catch(err => res.status(404).json({success: false}));
});


module.exports = {
    addForm: addForm,
    getDepartmentPendingForms: getDepartmentPendingForms,
    getRequestedFormsSocket: getRequestedFormsSocket,
    approveForm: approveForm,
    rejectForm: rejectForm,
    getApprovedFormsSocket:getApprovedFormsSocket,
    getRejectedFormsSocket:getRejectedFormsSocket

}
