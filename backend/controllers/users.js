const {User , UserSession } = require("../models/users");
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
    const username = user.username;
    await  UserSession.create({
        username
    })
    const UserSessionForUser = await UserSession.findOne({username});
    UserSessionForUser.numberOfTimesLoggedIn = UserSessionForUser.numberOfTimesLoggedIn ? Number(UserSessionForUser.numberOfTimesLoggedIn) + 1 : 1;
    UserSessionForUser.lastLogin = new Date();
    await user.save();
    await UserSessionForUser.save();
    console.log("user" + user + "user session " + UserSessionForUser);
    return res.status(200).send(user + "login successfull" + "sessions" + UserSessionForUser);

 }

 async function changeEmail(req,res)
 {
    const{email , newEmail} = req.body;
    console.log("session id of request " + req.sessionID)
    console.log("body for email change" + req.toString() + "previous email" + email);
    const user = await User.findOne({email});
    if(!user) res.send("invalid email");
    const username = user.username;
    const UserSessionForUser = await UserSession.findOne({username});
    UserSessionForUser.numberOfTimesLoggedIn = UserSessionForUser.numberOfTimesLoggedIn ? Number(UserSessionForUser.numberOfTimesLoggedIn) + 1 : 1;
    UserSessionForUser.lastLogin = new Date();
    user.email = newEmail;
    console.log("user after email" + user);
    user.save();
    UserSessionForUser.save();
    res.send("email changed" + user + "sessions " + UserSessionForUser );

 }

 async function changePhoneNumber(req,res)
 {
    const{phoneNumber,newPhoneNumber} = req.body;
    const user = await User.findOne({phoneNumber});
    if(!user) res.send("invalid phoneNumber");
    user.phoneNumber = newPhoneNumber;
    const username = user.username;
    const UserSessionForUser = await UserSession.findOne({username});
    UserSessionForUser.numberOfTimesLoggedIn = UserSessionForUser.numberOfTimesLoggedIn ? Number(UserSessionForUser.numberOfTimesLoggedIn) + 1 : 1;
    UserSessionForUser.lastLogin = new Date();
    user.save();
    UserSessionForUser.save();
    res.send("phone number changed" + user + "sessions" + UserSessionForUser);
 }

 async function handelGetUsers(req,res)
{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) res.send("wrong email address");
    res.send(user);
}

async function handelAllUsers(req,res)
{
    const user = await User.find({});
    if(!user) res.send("wrong email address");
    console.log("session id of request " + req);
    const UserSessionForUser = await UserSession.find({});
    res.send("details of all user are"  + user + "details of sessions are" + UserSessionForUser);
}
module.exports = {handelUserSignup , handelUserlogin ,changeEmail , changePhoneNumber , handelGetUsers , handelAllUsers};