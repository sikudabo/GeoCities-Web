const express = require('express');
const router = express.Router();
const { UserModel } = require('../../db/models');

router.route('/api/login').post(async (req, res) => {
    const { isEmailLogin } = req.body;

    try {
        if (isEmailLogin) {
            const { email, password } = req.body;
            const currentUser = await UserModel.findOne({ email });
            if (!currentUser) {
                res.status(200).json({ isError: true, message: 'We could not find the email you sent. Please try again!' });
                return;
            }

            if (password !== currentUser.password) {
                res.status(200).json({ isError: true, message: 'The password you entered is incorrect. Please try again!' });
                return;
            }

            res.status(200).json({ isError: false, message: 'Successful login!', user: currentUser });
            return;
        } else {
            const { fbId } = req.body;
            const currentFbUser = await UserModel.findOne({ fbId });
            
            if (!currentFbUser) {
                res.status(200).json({ isError: true, message: 'We could not find a user with that Facebook account. Please try again!' });
                return 
            }

            res.status(200).json({ isError: false, message: 'Successful login!', user: currentFbUser })
        }
    } catch(e) {
        console.log(`Server error logging a user in: ${e.message}`);
        res.status(200).json({ isError: true, message: 'There was an error logging you in. Please try again!' });
    }
});

module.exports = router;