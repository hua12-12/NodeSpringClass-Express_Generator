const mongoose = require('mongoose');
const followingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: [true, 'userId未填寫']
        },
        whoFollow: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: [true, 'userId未填寫']
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // select: false
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
)
const Post = mongoose.model('Following', followingSchema);

module.exports = Post