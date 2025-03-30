const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Course Name is required'],
        match: /^[a-zA-Z ]{2,20}$/
    },
    image: {
        type: String,
        // required : [true, 'Course Image is required'],
    },
    price: {
        type: Number,
        required: [true, 'Course Price is required'],
        match: /^[0-9]{1,15}$/
    },
    duration: {
        type: String,
        required: [true, 'Course Duration is required'],
    },
    description: {
        type: String,
        required: [true, 'Course Description is required'],
    },
    status: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 1,
        min: 1,
        max: [1000, 'Maximum limit reach']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: ''
    }

});

const courseModel = mongoose.model('courses', courseSchema);

module.exports = courseModel;