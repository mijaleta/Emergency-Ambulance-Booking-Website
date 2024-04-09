const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose')
const {isAdmin,isDispatcher} = require('../controllers/createadmin');
const nodemailer = require('nodemailer')
const router = express.Router();
const User = require('../models/user')
const Ambulance = require('../models/ambulance')
const Schedule = require('../models/schedule')
const Contact = require('../models/contact')
const BookingRequest = require('../models/patientRequest');
const crypto = require('crypto')
const bcrypt = require('bcrypt')


