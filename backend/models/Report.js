const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    reportedUser: { type: mongoose.Schema.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    reason: { type: String, required: true, maxlength: 200 },
    details: { type: String, maxlength: 2000 },
    status: {
      type: String,
      enum: ['open', 'reviewed', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
