import nodemailer from 'nodemailer'
import { userModel } from '~/models/userModel'
import bcrypt from 'bcrypt'
import { codeRecoverService } from './codeRecoverPw'
import { codeRecoverModel } from '~/models/codeRecoverPw'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { generateAccessToken } from '~/utils/Token'
import { userService } from './userService'

const sendEmail = async(reqbody) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  const user = await userService.findOneByEmail(reqbody.email)
  const token = generateAccessToken(user)


  const info = await transporter.sendMail({
    from: '"Itworks 👻" <nguyenhaocu0@gmail.com>', // sender address
    to: reqbody.email, // list of receivers
    subject: 'YOUR ITWORKS RECOVER PASSOWRD', // Subject line
    text: 'Hello world', // plain text body
    html: `<b>Access to this link to change your password <br> http://localhost:5173/auth/recover/${token}</b>` // html body
  })
  return info
}

export const emailService = {
  sendEmail
}