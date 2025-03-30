const coursesModel = require('../../models/courses.schema');


exports.create = async (request, response) => {

    console.log(request.body);
    // console.log(request.file);

    data = new coursesModel({
        name: request.body.name,
        price: request.body.price,
        image: request.body.image,
        duration: request.body.duration,
        description: request.body.description,
        status: request.body.status,
        order: request.body.order,
    });



    //await data.save() डेटाबेस में नया रिकॉर्ड सेव (Save) करने का काम करता है।
    await data.save().then((result) => {
        var res = {
            status: true,
            message: 'Record create succussfully',
            data: result
        }

        response.send(res);
    }).catch((error) => {
        var error_messages = [];

        for (let field in error.errors) {
            // console.log(field);
            error_messages.push(error.errors[field].message);
        }

        var res = {
            status: false,
            message: 'Something went wrong',
            error_messages: error_messages
        }

        response.send(res);
    })
}

exports.view = async (request, response) => {

    let condition = {
        deleted_at: null //सिर्फ उन्हीं रिकॉर्ड्स को दिखाना है जो डिलीट नहीं किए गए हैं (Soft Delete का हिस्सा)।
    }

    // उदाहरण:अगर request.body.name = "JavaScript" है, तो यह "javascript", "JAVASCRIPT", "Java Script" जैसे नाम भी ढूंढेगा।
    if (request.body.name != undefined) {
        if (request.body.name != '') {
            condition.name = new RegExp(request.body.name, 'i');
        }
    }

    if (request.body.price != undefined) {
        if (request.body.price != '') {
            condition.price = request.body.price;
        }
    }

    // अगर duration = "month" है, तो "1 Month", "3 Months", "MONTHLY" जैसे रिजल्ट्स दिखाएगा।
    if (request.body.duration != undefined) {
        if (request.body.duration != '') {
            condition.duration = new RegExp(request.body.duration, 'i');
        }
    }

    if (request.body.status != undefined) {
        if (request.body.status != '') {
            condition.status = request.body.status;
        }
    }

    console.log(condition);
    await coursesModel.find(condition)
        .sort({ _id: -1 })  // नए डेटा को सबसे पहले दिखाने के लिए _id को Descending (-1) करें
        .then((result) => {
            //अगर रिकॉर्ड मिले (result.length > 0)
            if (result.length > 0) {
                var res = {
                    status: true,
                    message: 'Record found successfully !!',
                    data: result
                }

                response.send(res);
            } else {
                //गर कोई रिकॉर्ड नहीं मिला (result.length === 0)
                var res = {
                    status: false,
                    message: 'No Record found !!',
                    data: ''
                }

                response.send(res);
            }
        }).catch((error) => {
            var res = {
                status: false,
                message: 'Something went wrong !!',
            }

            response.send(res);
        });


}

exports.details = async (request, response) => {
    //🔹 यह एक condition (शर्त) बनाई गई है, जो यह चेक करेगी कि deleted_at = null होना चाहिए।
    var condition = {
        deleted_at: null
    }
    //findById फंक्शन वह id सर्च करेगा, जो यूजर ने URL में दी होगी।
    await coursesModel.findById(request.params.id).then((result) => {
        if (result != '') {
            var res = {
                status: true,
                message: 'Record found successfully !!',
                data: result
            }

            response.send(res);
        } else {
            var res = {
                status: false,
                message: 'No Record found !!',
                data: ''
            }

            response.send(res);
        }
    }).catch((error) => {
        var res = {
            status: false,
            message: 'Something went wrong !!',
        }

        response.send(res);
    });
}

exports.update = async (request, response) => {

    console.log(request.file);
    data = {
        name: request.body.name,
        price: request.body.price,
        duration: request.body.duration,
        description: request.body.description,
        status: request.body.status ?? 1,
        order: request.body.order ?? 1,
    };



    await coursesModel.updateOne(
        {
            _id: request.body.id  // जिस कोर्स की ID दी गई है, उसे अपडेट करेंगे
        },
        {
            $set: data  // नए डेटा से अपडेट करेंगे
        }
    )
        .then((result) => {

            var res = {
                status: true,
                message: 'Record update succussfully',
                data: result
            }

            response.send(res);
        }).catch((error) => {
            var error_messages = [];

            for (let field in error.errors) {
                // console.log(field);
                error_messages.push(error.errors[field].message);
            }

            var res = {
                status: false,
                message: 'Something went wrong',
                error_messages: error_messages
            }

            response.send(res);
        })
}

exports.changeStatus = async (request, response) => {
    //findOne(): सिर्फ एक डॉक्यूमेंट रिटर्न करता है (पहला मिला हुआ)
    //find(): सभी मैचिंग डॉक्यूमेंट्स की array रिटर्न करता है
    const courseData = await coursesModel.findOne({
        _id: request.body.id
    });

    // console.log(courseData.length);

    if (courseData == null) {
        var res = {
            status: false,
            message: 'Id not match in the database',
        }

        response.send(res);
    }

    await coursesModel.updateOne(
        {
            _id: request.body.id //कौनसा डॉक्यूमेंट ढूंढना है
        },
        {
            $set: {
                status: request.body.status //क्या बदलना है
            }
        }
    )
        .then((result) => {

            var res = {
                status: true,
                message: 'Record update succussfully',
                data: result
            }

            response.send(res);
        }).catch((error) => {

            var res = {
                status: false,
                message: 'Something went wrong',
            }

            response.send(res);
        })
}

exports.delete = async (request, response) => {

    console.log(request.body.id);

    const courseData = await coursesModel.findOne({
        _id: request.body.id,
        deleted_at: null //🔹 deleted_at: null का मतलब है कि सिर्फ़ वही रिकॉर्ड चेक करें जो पहले से डिलीट नहीं किया गया।


    });
    //अगर id डेटाबेस में नहीं मिली
    if (courseData == null) {
        var res = {
            status: false,
            message: 'Id not match in the database',
        }

        return response.send(res);
    }

    //🔹 अब यह रिकॉर्ड फिज़िकली डिलीट नहीं हुआ, लेकिन दिखेगा भी नहीं।
    await coursesModel.updateOne(
        {
            _id: request.body.id
        },
        {
            //🔹 $set ऑपरेटर का उपयोग करके deleted_at फ़ील्ड में करंट टाइम सेव कर दिया गया।
            $set: {
                deleted_at: Date.now()
            }
        }
    )
        .then((result) => {

            var res = {
                status: true,
                message: 'Record delete succussfully',
            }

            response.send(res);
        }).catch((error) => {

            var res = {
                status: false,
                message: 'Something went wrong',
            }

            return response.send(res);
        })

}

exports.multipleDelete = async (request, response) => {
    try {
        let result = await coursesModel.updateMany(
            { _id: { $in: request.body.ids } }, //✅ $in जो भी IDs इस Array में होंगी, उन्हें Update किया जाएगा।

            { $set: { deleted_at: Date.now() } } //$set ऑपरेटर है, जिसका उपयोग किसी फ़ील्ड को Update करने के लिए किया जाता है।
        );

        if (result.modifiedCount > 0) {
            response.send({
                status: true,
                message: `${result.modifiedCount} Courses deleted successfully`,
            });
        } else {
            response.send({
                status: false,
                message: "No matching courses found",
            });
        }
    } catch (error) {
        response.send({
            status: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};
