const express = require('express');
const router  = express.Router();
const { Resend } = require('resend');

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const isAuthenticated = (req, res, next) => {
  if (!req.headers.userid) {
    return res.status(401).json({ message: 'Auth required' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.headers.userrole !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

router.post('/', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const { to, subject, html } = req.body || {};

    if (!to || !subject || !html) {
      return res
        .status(400)
        .json({ message: 'to, subject & html fields are required' });
    }

    const { id } = await resend.emails.send({
      from: 'TheGoodCameraStore <319websitetest@the-brik.com>',
      to:   Array.isArray(to) ? to : [to],   
      subject,
      html
    });

    return res.json({ message: 'Sent!', id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
