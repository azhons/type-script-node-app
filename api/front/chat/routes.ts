import express = require('express');
var jwt = require('jsonwebtoken');

var router = express.Router();

router.post('/auth', function (req, res, next) {
    var profile;
    if (req.body.id == 1) {
        profile = {
            first_name: 'Ivan',
            id: 123
        };
    }
    else
    {
        profile = {
            first_name: 'John',
            id: 123
        };
    }

    var token = jwt.sign(profile, "my secret", { expiresInMinutes: 60 * 5 });

    res.json({ token: token });
});

export = router;