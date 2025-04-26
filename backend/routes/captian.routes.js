const express=require('express');
const router=express.Router();
const captainController=require('../controllers/captian.controller')
const authMiddleware=require('../middlewares/auth.middleware')
const {body}=require('express-validator')

router.post('/register',[
    body('email').isEmail().withMessage('invalid email'),
    body('fullname.firstname').isLength({min:3}).withMessage('first name invalid'),
    body('password').isLength({min:6}).withMessage('password must be 6 characters long'),
    body('vehicle.color').isLength({min:3}).withMessage('color should have 3 characters'),
    body('vehicle.plate').isLength({min:3}).withMessage('plate should have 3 characters'),
    body('vehicle.capacity').isNumeric().withMessage('capacity should be a number'),
    body('vehicle.vehicleType').isIn(['car','motorcycle','auto']).withMessage('vehicle type should be car,motorcycle,auto')
]
    ,captainController.registerCaptain
)

router.post('/login',[
    body('email').isEmail().withMessage('invalid email'),
    body('password').isLength({min:6}).withMessage('password must be 6 characters long')
],captainController.loginCaptain);

//authenticated routes
router.get('/profile',authMiddleware.authCaptain,captainController.getCaptainProfile);
router.get('/logout',authMiddleware.authCaptain,captainController.logoutCaptain);

module.exports=router;
