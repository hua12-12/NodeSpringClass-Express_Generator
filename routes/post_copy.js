var express = require("express");
var router = express.Router();
const postModel = require('../models/post');
//要導入，populate才可以使用
// const userModel = require('../models/user');
const commentDetailModel = require('../models/commentDetail');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
// Temp
const refreshToken = require('../middleware/file/imgur/refreshToken');
const uploadImg = require('../middleware/file/imgur/upload');
const appError = require('../services/appError');
var multer = require('multer');
var uploadMulter = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true)
            return
        } else {
            cb(null, false)
            return cb(new Error('Allowed only .png, .jpg, .jpeg'))
        }
    }
})





//get all
router.get('', async (req, res) => {
    // 找到關聯user資料 populate
    // const user = await postModel.find().populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    // console.log(user);

    // 測試1
    // dataModel.find().exec((err, datas)=>{
    //     res.json(datas);
    // });

    // 測試2
    // postModel.find().limit(50).exec(function (err, datas) {
    //     // console.log(docs);
    //     res.status(200).json({
    //         status: 'success',
    //         datas,
    //     });
    // });




    //測試3
    postModel.find().limit(50).populate({
        path: 'user',
        select: 'name photo'
    }).populate({
        path: 'commentDetail',
        select: 'user content likes whoLikes createdAt updatedAt',
        populate: {
            path: 'user',
            select: 'name photo'
        }
    }).exec(function (err, datas) {
        res.status(200).json({
            status: 'success',
            datas,
        });
    });
});





// get by postId
router.get('/:id', (req, res, next) => {

    const id = req.params.id;
    // 測試1
    // postModel.findById(id).exec(function (err, datas) {
    //     // console.log(docs);
    //     if (!datas) {
    //         res.status(200).json({
    //             status: 'success',
    //             datas,
    //         });
    //     } else {
    //         res.status(401).json({
    //             status: 'false',
    //             message: "欄位未填寫正確，或無此 todo ID",
    //         });
    //     }
    // });



    // 測試2
    postModel.findById(id).populate({
        path: 'user',
        select: 'name photo'
    }).populate({
        path: 'commentDetail',
        select: 'user content likes whoLikes createdAt updatedAt',
        populate: {
            path: 'user',
            select: 'name photo'
        }
    }).exec(function (err, datas) {
        if (datas) {
            res.status(200).json({
                status: 'success',
                datas,
            });
        } else {
            return next(appError(400, "欄位未填寫正確", next));
            // res.status(401).json({
            //     status: 'false',
            //     message: "欄位未填寫正確，或無此 todo ID",
            // });
        }
    });

});


// get by userId
router.get('/by-userId/:id', (req, res, next) => {

    const id = req.params.id;
    // 測試1
    // postModel.findById(id).exec(function (err, datas) {
    //     // console.log(docs);
    //     if (!datas) {
    //         res.status(200).json({
    //             status: 'success',
    //             datas,
    //         });
    //     } else {
    //         res.status(401).json({
    //             status: 'false',
    //             message: "欄位未填寫正確，或無此 todo ID",
    //         });
    //     }

    // });

    // 測試2
    postModel.find({ user: id }).populate({
        path: 'user',
        select: 'name photo'
    }).populate({
        path: 'commentDetail',
        select: 'user content likes whoLikes createdAt updatedAt',
        populate: {
            path: 'user',
            select: 'name photo'
        }
    }).exec(function (err, datas) {
        if (datas) {
            res.status(200).json({
                status: 'success',
                datas,
            });
        } else {
            // res.status(401).json({
            //     status: 'false',
            //     message: "欄位未填寫正確，或無此 user ID",
            // });
            return next(appError(400, "欄位未填寫正確", next));
        }
    });
});


// get by userId with regex content
router.post('/by-userId/:id', (req, res, next) => {

    const id = req.params.id;
    const obj = req.body;

    // 測試2
    postModel.find({ user: id, content: { $regex: obj['content'] } }).populate({
        path: 'user',
        select: 'name photo'
    }).populate({
        path: 'commentDetail',
        select: 'user content likes whoLikes createdAt updatedAt',
        populate: {
            path: 'user',
            select: 'name photo'
        }
    }).exec(function (err, datas) {
        if (datas) {
            res.status(200).json({
                status: 'success',
                datas,
            });
        } else {
            // res.status(401).json({
            //     status: 'false',
            //     message: "欄位未填寫正確，或無此 user ID",
            // });
            return next(appError(400, "欄位未填寫正確", next));
        }
    });
});






// get by regex content
router.post('/by-content', (req, res) => {
    const obj = req.body;
    console.log(obj.content);
    if (obj['content'] === undefined) {
        res.status(401).json({
            status: 'false',
            message: "欄位未填寫正確",
        });
    } else {
        // const regex = new RegExp('/'+obj['content']+'/');
        // const reg='/'+obj['content']+'/';
        postModel.find({ content: { $regex: obj['content'] } }).populate({
            path: 'user',
            select: 'name photo'
        }).populate({
            path: 'commentDetail',
            select: 'user content likes whoLikes createdAt updatedAt',
            populate: {
                path: 'user',
                select: 'name photo'
            }
        }).exec(function (err, datas) {
            res.status(200).json({
                status: 'success',
                datas,
            });
        });
    }
})



// // get by one regex property
// router.post('/posts-by-property', (req, res) => {
//     const properties = ['name', 'tags', 'type', 'image', 'content'];
//     const obj = req.body;
//     const keys_1 = Object.keys(obj);
//     var resObj = obj;
//     const propertyName = keys_1;
//     postModel.find({ propertyName: { $regex: obj[propertyName] } }).populate({
//         path: 'user',
//         select: 'name photo'
//     }).exec().then((datas) => {
//         res.status(200).json({
//             status: 'success',
//             datas,
//         });
//     }).catch((err) => {
//         res.status(401).json({
//             status: 'false',
//             message: "欄位未填寫正確",
//         });
//     });
// })



// // post_1 no Image Process
// router.post('/posts_1', (req, res, next) => {
//     // const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
//     const properties = ['name', 'tags', 'type', 'image', 'content'];
//     const obj = req.body;
//     const keys_1 = Object.keys(obj);
//     var resObj = obj;
//     postModel.create(resObj)
//         .then((data) => {
//             resObj = {};
//             var fail = 0;
//             keys_1.forEach((value) => {
//                 if (properties.indexOf(value) === -1) {
//                     fail += 1;
//                 }
//                 resObj[value] = obj[value];
//             })
//             if (fail > 0) {
//                 res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
//             } else {
//                 res.status(200).json({
//                     status: "success",
//                     data,
//                 });
//             }
//         })
//         .catch(() => {
//             // res.status(200).json({
//             //     status: 'false',
//             //     data: '新增失敗',
//             // })
//             return next(appError(400, "新增失敗", next));
//         });
// });




// post_2 with Image Imgur Process
router.post('/with-FormDataImage', uploadMulter.single('image'), refreshToken, uploadImg, ( req, res, next) => {
    const properties = ['user', 'tags', 'type', 'image', 'content'];
    const obj = req.body;
    const keys_1 = Object.keys(obj);
    obj.image = req.imgFile.link;
    var resObj = obj;
    postModel.create(resObj)
        .then((data) => {
            resObj = {};
            var fail = 0;
            keys_1.forEach((value) => {
                if (properties.indexOf(value) === -1) {
                    fail += 1;
                }
                resObj[value] = obj[value];
            })
            if (fail > 0) {
                // res.status(400).json({ status: 'false', message: "欄位未填寫正確" });
                return next(appError(400, "欄位未填寫正確", next));
            } else {
                res.status(200).json({
                    status: "success",
                    data,
                });
            }
        })
        .catch(() => {
            // res.status(200).json({
            //     status: 'false',
            //     message: '新增失敗',
            // })
            return next(appError(400, "新增失敗", next));
        });
});


// post_3 with Image Imgur Process
router.post('/with-UrlImage', (req, res) => {
    const properties = ['user', 'tags', 'type', 'image', 'content'];
    const obj = req.body;
    const keys_1 = Object.keys(obj);
    // obj.image = req.imgFile.link;
    var resObj = obj;
    postModel.create(resObj)
        .then((data) => {
            resObj = {};
            var fail = 0;
            keys_1.forEach((value) => {
                if (properties.indexOf(value) === -1) {
                    fail += 1;
                }
                resObj[value] = obj[value];
            })
            if (fail > 0) {
                res.status(400).json({ status: 'false', message: "欄位未填寫正確" });
            } else {
                res.status(200).json({
                    status: "success",
                    data,
                });
            }
        })
        .catch(() => {
            res.status(200).json({
                status: 'false',
                message: '新增失敗',
            })
        });
});




// patch
router.patch('/:id', (req, res) => {
    const obj = req.body;
    const keys_1 = Object.keys(obj);
    // const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
    const properties = ['user', 'tags', 'type', 'image', 'content', 'likes', 'whoLikes', 'comments'];
    var resObj = obj;
    const id = req.params.id;
    postModel.findByIdAndUpdate(id, resObj)
        .then((result) => {
            var fail = 0;
            if (!result) {
                throw new Error(false);
            }
            keys_1.forEach((value) => {
                if (properties.indexOf(value) === -1) {
                    fail += 1;
                }
                resObj[value] = obj[value];
            })
            if (fail > 0) {
                res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });

            } else {
                res.status(200).json({
                    status: 'success',
                    data: '更新成功',
                })
            }
        })
        .catch(() => {
            res.status(400).json({
                status: 'false',
                data: '更新失敗或無此ID',
            })
        });
})

// delete all
router.delete('', (req, res) => {
    postModel.deleteMany({}, () => {
        res.status(200).json({
            status: 'success',
            data: '刪除成功',
        })
    });
})

// delete id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    // 測試 START
    const post = await postModel.findOne({ _id: id });
    await post.commentDetail.forEach(async (commentId)=>{
        await commentDetailModel.findByIdAndDelete(commentId).then((result)=>{
            console.log(result);
        }).catch((err)=>{
            throw new Error('Delete commentDetail fail');
        })
    });
    // END
    postModel.findByIdAndDelete(id)
        .then((result) => {
            if (!result) {
                throw new Error(false);
            } else {
                res.status(200).json({
                    status: 'success',
                    data: '刪除成功',
                })
            }
        })
        .catch(() => {
            res.status(200).json({
                status: 'false',
                data: '刪除失敗或無此ID',
            })
        });
})



// // 網址輸入錯誤處理
// router.use((req, res, next) => {
//     // 404:網址錯誤
//     res.status(404).json({
//         status: 'false',
//         data: '網址輸入錯誤'
//     })
// })


// // 程式錯誤處理
// router.use((req, res, next) => {
//     // 500:程式錯誤
//     res.status(500).json({
//         status: 'false',
//         data: '程式發生問題，請稍後嘗試'
//     })
// })




module.exports = router