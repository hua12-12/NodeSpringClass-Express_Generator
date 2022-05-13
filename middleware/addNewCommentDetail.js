
const commentDetailModel = require('../models/commentDetail');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });


// 連結
const DB = process.env.DATABASE
    .replace(
        '<username>',
        process.env.DATABASE_USERNAME
    )
    .replace(
        '<password>',
        process.env.DATABASE_PASSWORD
    )
mongoose.connect(DB)
    .then((res) => {
    })
    .catch((err) => {
    });


function addNewCommentDetail(req, res, next) {
    const obj = req.body;
    commentDetailModel.create(obj).then(data => {
        console.log(data);
        const user_Id = data._id.toString();
        req.commentDetailId = user_Id;
        next();
    }).catch(() => {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
    })
}



module.exports = addNewCommentDetail;