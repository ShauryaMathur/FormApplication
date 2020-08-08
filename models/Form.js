const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const FormSchema = new Schema({
    createdBy: {
        type: String,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    targetUser: {
        type: String,
        required: true
    },
    targetUserEmail: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true
    }

});

module.exports = Form = mongoose.model('form', FormSchema);
