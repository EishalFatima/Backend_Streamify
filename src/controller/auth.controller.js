import User from "../models/User.js";
import jwt from 'jsonwebtoken'

export async function Signup(req , res){
const {email , password , fullName} = req.body
try {
  if(!email || !password   || !fullName ){
    return res.status(400).json({message : 'All the fields are required.'})
  } 
  if(password.length < 6){
       return res.status(400).json({message : 'password should be atleast 6 characters long.'})
  } 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
      return res.status(400).json({
        message : 'Email is invalid.'
      })
  }

  const exsistingUser = await  User.findone({email})
  if (exsistingUser){
      return res.status(400).json({
        message : 'Email already exsists.Please use a different one.'
      })
  }
  const newUser = await User.Create({
    email ,
    fullName,
    password
  })
   const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
    expiresIn : '7d'
   })
res.cookie('jwt' , token ,{
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
    sameSite : 'strict',
    secure : process.env.NODE_ENV === 'production'
})
res.status(201).json({
    success : true,
    user : newUser
})
} catch (error) {
    console.log('Error in signup controller' , error);
    res.status(500).json({
       message : 'Internal server error.'
        
    })
}





}
export async function Login(req , res){
res.send('Login route')
}
export async function Logout(req , res){
res.send('Logout route')
}
