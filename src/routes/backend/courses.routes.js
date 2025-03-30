const express = require('express');
const route = express.Router();
const coursesController = require('../../controllers/backend/courses.controller')



module.exports = app => {


    route.post('/add', coursesController.create);

    route.post('/view', coursesController.view);

    route.post('/details/:id', coursesController.details)

    route.put('/update', coursesController.update)

    route.put('/change-status', coursesController.changeStatus)

    route.post('/delete', coursesController.delete)

    route.post('/multiple-delete', coursesController.multipleDelete)

    app.use('/api/backend/courses', route);

}