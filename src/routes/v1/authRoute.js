import express from 'express'
import passport from 'passport'


const Router = express.Router()

Router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session:false }))

Router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) return res.redirect(`${process.env.URL_CLIENT}/auth/login`)
    const { token } = user
    return res.redirect(`${process.env.URL_CLIENT}auth/login-success/${token}`)
  })(req, res, next)
})

Router.get('/facebook',
  passport.authenticate('facebook', { session:false, scope:['email'] }))

Router.get('/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) return res.redirect(`${process.env.URL_CLIENT}/auth/login`)
    const { token } = user
    return res.redirect(`${process.env.URL_CLIENT}auth/login-success/${token}`)
  })(req, res, next)
})

export const auth20 = Router
