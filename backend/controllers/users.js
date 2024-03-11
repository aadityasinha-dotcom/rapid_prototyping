const User = require("../models/users");
const{v4:uuidv4} = require("uuid");
const {setUser} = require("../service/auth");

async function handelUserSignup(req,res){
    console.log(req.body) ;
    const {username , email , password , phoneNumber} = req.body;
    await User.create({
        username,
        email,
        password,
        phoneNumber
    })
    console.log("user created from model");
    return res.send("user created");
}

async function handelUserlogin(req,res){
    console.log(req.body) ;
    const {email , password} = req.body;
    const user = await User.findOne({email,password})
    if(!user) return res.send("invalid email or password");
    const sessionId = uuidv4();
    setUser(sessionId,user);
    res.cookie("uid" , sessionId);
    return res.send("login successfull");
}
module.exports = {handelUserSignup , handelUserlogin};