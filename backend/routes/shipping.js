const express = require('express');
const fetch   = (...args) => import('node-fetch').then(m => m.default(...args));
const router  = express.Router();

const FEDEX_CLIENT_ID     = "l7d6c247916bda41259708c20a5064e1fe"
const FEDEX_CLIENT_SECRET = "d1b952be38ef4695b63ee44967d0dfa1"
const FEDEX_ACCOUNT       = "740561073"

const isAuthenticated = (req, _res, next) => {
  if (!req.headers.userid) return res.status(401).json({ message:'Auth required' });
  next();
};
const isAdmin = (req, res, next) => {
  if (req.headers.userrole !== 'admin')
    return res.status(403).json({ message:'Admin only' });
  next();
};
let cachedToken   = null;
let tokenExpires  = 0;
async function getFedExToken () {
  if (cachedToken && Date.now() < tokenExpires) return cachedToken;

  const res = await fetch('https://apis-sandbox.fedex.com/oauth/token', {
    method : 'POST',
    headers: { 'Content-Type':'application/x-www-form-urlencoded' },
    body   : new URLSearchParams({
      grant_type   : 'client_credentials',
      client_id    : FEDEX_CLIENT_ID,
      client_secret: FEDEX_CLIENT_SECRET
    })
  });
  if (!res.ok) throw new Error(`OAuth failed ${res.status}`);

  const j = await res.json();
  cachedToken  = j.access_token;
  tokenExpires = Date.now() + (j.expires_in - 60) * 1000;   // 60 s safety
  return cachedToken;
}

router.post('/estimate', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const { fromZip, toZip, weightLb } = req.body;
    if (!fromZip || !toZip || !weightLb)
      return res.status(400).json({ message:'fromZip, toZip & weightLb required' });

    const fedexBody = {
      accountNumber:{ value: FEDEX_ACCOUNT },
      requestedShipment: {
        shipper   : { address:{ postalCode: fromZip, countryCode:'US' } },
        recipient : { address:{ postalCode: toZip,   countryCode:'US' } },
        pickupType: 'DROPOFF_AT_FEDEX_LOCATION',
        rateRequestType:['ACCOUNT','LIST'],
        requestedPackageLineItems:[{
          weight:{ units:'LB', value:+weightLb }
        }]
      }
    };

    const token = await getFedExToken();
    const quoteRes = await fetch('https://apis-sandbox.fedex.com/rate/v1/rates/quotes', {
      method : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fedexBody)
    });

    if (!quoteRes.ok) {
      const txt = await quoteRes.text();
      throw new Error(`FedEx quote error ${quoteRes.status}: ${txt}`);
    }

    const raw = await quoteRes.json();
    const rates = raw.output.rateReplyDetails.map(r => ({
      service : r.serviceName,
      amount  : r.ratedShipmentDetails[0].totalNetCharge
    }));

    res.json({ rates });

  } catch (err) { next(err); }
});

module.exports = router;
