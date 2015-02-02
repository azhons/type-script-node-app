/// <reference path="../../typings/all.ts" />
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
router.post('/auth', function (req, res, next) {
    var profile;
    if (req.body.id == 1) {
        profile = { id: 1 };
    }
    else {
        profile = { id: 2 };
    }
    var token = jwt.sign(profile, "my secret", { expiresInMinutes: 60 * 5 });
    res.json({ token: token });
});
module.exports = router;
//# sourceMappingURL=routes.js.map