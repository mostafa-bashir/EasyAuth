const express = require('express');
const router = express.Router();


const {User} = require('../models');

router.get('/:id', async (req,res)=>{

    const id = req.params.id;
    
    const user = await User.findByPk(id);
    console.log(user)

    if(user && user.virfied != true){
        user.virfied = true
        await user.save();
        res.render('virfied')
    }else{
        res.render('error')
    }
})

module.exports = router;