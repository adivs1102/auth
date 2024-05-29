import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router();
import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body
    const user=await User.findOne({email})
    if(user){
        return res.json({message:"User already exists"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    await newUser.save()
    return res.json({status:true,message:"User created successfully"})
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.json({ message: "User does not exist" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.json({ message: "Invalid credentials" })
    }
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.cookie('token', token, { maxAge: 3600000, httpOnly: true})
    return res.json({ status: true, message: "User logged in successfully" })
})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: "User does not exist" })
        }
        const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: '10m' })

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'aadityavir11@gmail.com',
              pass: 'xleu wopa qhti ngne'
            }
          });
          
          var mailOptions = {
            from: 'aadityavir11@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetPassword/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              return res.json({status:false,message:"error sending email"})
            } else {
              return res.json({status:true,message:"email sent"})
            }
          });

    } catch (error) {
        console.log(error)
    }
})

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    try{
        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_KEY)
        const id=decoded.id
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate({_id:id}, { password: hashedPassword })
        return res.json({status:true,message:"Password reset successfully"})
    }
    catch(error){
        return res.json({status:false,message:"Invalid or expired token"})
    }
})

const verifyUser = async (req, res, next) => {
    const token = req.cookies.token
    try {
        if (!token) {
            // console.log("no token")
            return res.json({status:false, message: "no token" })
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        // req.user = decoded
        next()
    } catch (error) {
        return res.json(error)
    }
}

router.get('/verify',verifyUser, (req, res) => {
    return res.json({status:true,message:"authorized"})
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({status:true,message:"logged out"})
})

export { router as UserRouter}