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
    const token = setUser(user);
    res.cookie("uid",token);
    user.numberOfTimesLoggedIn = user.numberOfTimesLoggedIn ? Number(user.numberOfTimesLoggedIn) + 1 : 1;

    user.save()
    console.log("user" + user);
    return res.status(200).send(user.numberOfTimesLoggedIn + "login successfull");

 }

 async function changeEmail(req,res)
 {
    const{email , newEmail} = req.body;
    console.log("body for email change" + JSON.stringify(req.body) + "previous email" + email);
    const user = await User.findOne({email});
    if(!user) res.send("invalid email");
    console.log("user after email" + user);
    user.email = newEmail;
    res.send("email changed" + user);

 }

 async function changePhoneNumber(req,res)
 {
    const{phoneNumber,newPhoneNumber} = req.body;
    const user = await User.findOne({phoneNumber});
    if(!user) res.send("invalid phoneNumber");
    user.phoneNumber = newPhoneNumber;
    res.send("phone number changed" + user);

 }

 async function handelGetUsers(req,res)
{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) res.send("wrong email address");
    res.send("details of user are"  + user);
}

async function handelAllUsers(req,res)
{
    const user = await User.find({});
    if(!user) res.send("wrong email address");
    res.send("details of all user are"  + user);
}
module.exports = {handelUserSignup , handelUserlogin ,changeEmail , changePhoneNumber , handelGetUsers , handelAllUsers};