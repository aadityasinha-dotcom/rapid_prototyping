const express = require("express");
const router = express.Router();
const {handelUserSignup , handelUserlogin} = require("../controllers/users");
/*router.get("/" , (req,res) =>{
    const html = `
    <ul>
        ${users.map((user)=>`<li> ${user.first_name}</li>`)}
    </ul>`;

    return res.send(html);
})
router.get("/:id" , (res,req) =>{
    const id = req.params.id;
    const user = users.find((user) => user.id === id );
    return res.send(user);
})

router.patch("/" ,(res,req)=>{
    
    return res.json({"status":"pending"});
})

router.post("/" ,(req,res)=>{
    console.log(req.body);
    const body = req.body;
    users.push({...body , id : users.length+1});
    fs.writeFile("./mock.json" , JSON.stringify(users) , (err,data)=>{ 
        return res.json({status:"success",id:users.length});  
    })

})

router.delete("/:id" ,(res,req)=>{
    return res.json({"status":"pending"});
})

router.post("/signup" ,(req,res)=>{

    const {name,email,password} = req.body;
    user.create({
        name,
        email,
        password
    });

})

router.get("/login", (req,res)=>{
    const {email,password} = req.body;
    const user = User.findOne({email,password});
    if(!user)
    {
        return res.send("user not found");
    }

})*/
router.post("/",handelUserSignup);
router.post("/login",handelUserlogin);
module.exports = router;
