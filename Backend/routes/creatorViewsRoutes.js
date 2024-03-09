const express = require('express');
const router = express.Router();
const Creator = require('../models/Creator');

router.get('/creatorviews/:creatorchannelid', async (req, res) => {
  const { creatorchannelid } = req.params;
  try {
    const creator = await Creator.findOneAndUpdate(
      { creatorchannelid },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    res.status(200).json({ views: creator.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;