const express = require('express');
const router = express.Router();



const multerMiddleware = require('../services/multer');
const upload = multerMiddleware('images'); // esm el folder

const {User} = require('../models');




router.get('/', (req,res)=>{
    console.log(req.session.user,'....')
    res.render('main',{
        user: req.session.user
    })
})

// avatar dah el hb3t beh el request
router.post('/update', upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findByPk(req.session.user.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update user details
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.age = req.body.age || user.age;

        // Update the image path only if a new file is uploaded
        if (req.file) {
            user.imagePath = req.file.path;
        }

        // router.use('/images', express.static(__dirname+'/../images'));
        
        // Save updated user
        await user.save();

        // Update session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            age: user.age,
            imagePath: req.file.path
        };

        
        // Render the main view
        res.render('main', {
            user: req.session.user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;