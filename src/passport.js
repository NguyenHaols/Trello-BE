var GoogleStrategy = require('passport-google-oauth20').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
import passport from 'passport'
import { userService } from './services/userService'
import { userModel } from './models/userModel'
import { generateAccessToken } from './utils/Token'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:1302/v1/auth/google/callback'
},
async function(accessToken, refreshToken, profile, cb) {
  // console.log(profile)
  if (profile?.id) {
    const email = profile.emails[0]?.value
    let user = await userModel.findOneByEmail(email)
    if (!user) {
      const data = {
        username: profile.displayName,
        email: email,
        avatar: profile.photos[0].value,
        password: '123456'
      }
      user = await userService.createNew(data)
    }
    const token = generateAccessToken(user)
    return cb(null, { profile, token })
  }
  return cb(null, false)
}
))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:1302/v1/auth/facebook/callback',
  profileFields: ['id', 'email', 'photos', 'displayName']
},
async function(accessToken, refreshToken, profile, cb) {
  console.log(profile)
  if (profile?.id) {
    const email = profile.emails[0]?.value
    let user = await userModel.findOneByEmail(email)
    if (!user) {
      const data = {
        username: profile.displayName,
        email: email,
        avatar: profile.photos[0].value,
        password: '123456'
      }
      user = await userService.createNew(data)
    }
    const token = generateAccessToken(user)
    return cb(null, { profile, token })
  }
  return cb(null, false)
}
))