const User= require('../models/user.model');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

const signUp= async(req, res)=>{
    try {
        const {name, email, password}= req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        const userExist= await User.findOne({email});
        if(userExist){
            return res.status(409).json({message: 'User already exists.'});
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const newUser= new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({message: 'User sign up successfully', user:newUser});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal server error'});
    }
};

const login= async(req, res)=>{
    try {
        const {email, password}= req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Email and Password are required'});
        }

        const userExist= await User.findOne({email});
        if(!userExist){
            return res.status(401).json({message: 'Invalid Credentials'});
        }

        const isMatch= await bcrypt.compare(password, userExist.password);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid Credentials'});
        }

        const token= jwt.sign({id: userExist._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({message: 'User login successful', token});
        
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
};

const getAllUsers= async(req, res)=>{
    try {
        const users= await User.find().select('-password');

        if(users.length == 0){
            return res.status(400).json({message: 'Users not found'});
        }

        res.status(200).json({message: 'Users fetched successfully', users:users});
        
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
};


module.exports= {signUp, login, getAllUsers};