import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { UserRouter } from './routes/user.js'
import path from 'path'

const app = express()
app.use(express.json())
const _dirname=path.dirname("")
const buildpath=path.join(_dirname,"../client/dist")
app.use(express.static(buildpath))
app.use(cors(
    {
        origin: ["http://localhost:5173"],
        credentials: true
    }
))
app.use(cookieParser())
app.use('/auth', UserRouter)


mongoose.connect(process.env.URI)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})