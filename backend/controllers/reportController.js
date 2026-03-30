const Report = require('../models/Report');

const createReport = async (req, res) => {
  try {
    const { reportedUserId, postId, reason, details } = req.body;

    if (!reason || String(reason).trim().length < 3) {
      return res.status(400).json({ message: 'Indicá un motivo de reporte' });
    }

    const report = await Report.create({
      reporter: req.user.id,
      reportedUser: reportedUserId || undefined,
      post: postId || undefined,
      reason: String(reason).slice(0, 200),
      details: details ? String(details).slice(0, 2000) : undefined,
    });

    res.status(201).json({ success: true, id: report._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport };
