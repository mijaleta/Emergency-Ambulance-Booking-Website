const User = require('../models/user'); // Import User Model
const bcrypt = require('bcrypt');

async function createAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            // console.log('Admin user already exists');
            return;
        }
       // Create admin user
  const adminPassword = 'a'; // Set the password for the admin user
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10); // Hash the password
  const adminUser = new User({
      name:'General Admin',
      username: 'a',
      mobile_number:'0973284058',
      password: hashedAdminPassword, // Use the hashed password
      role: 'admin',
      email:'miratuujaallataa@gmail.com'
  });
        // Save admin user to the database
        await adminUser.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } 
  }
  
  // Call function to create admin user
  createAdmin();
  
  // Middleware to check if user is admin
  function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('not authorized');
  }
    // Middleware to check if user is admin
    function isDispatcher(req, res, next) {
        if (req.user && req.user.role === 'dispatcher') {
            return next();
        }
        res.status(403).send('not authorized');
      }
  module.exports={isAdmin,isDispatcher}
