const express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/',
    require('connect-ensure-login').ensureLoggedOut(),
    (req, res) => {
        res.redirect('http://localhost:3000/telegram/setup');
        //res.render('login', {user : null});
    });

router.get('/facebook',
    require('connect-ensure-login').ensureLoggedOut(),
    passport.authenticate('facebook', {
        scope: [
            'email',
            'user_posts',
            'manage_pages',
            'publish_pages'
        ]
    }));

router.get('/facebook/callback',
    require('connect-ensure-login').ensureLoggedOut(),
    passport.authenticate('facebook', {failureRedirect: '/login'}),
    (req, res) => {
        res.redirect('/');
    });

module.exports = router;