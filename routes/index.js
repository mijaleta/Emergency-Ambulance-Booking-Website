const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const { isAdmin, isDispatcher } = require("../controllers/createadmin");
const nodemailer = require("nodemailer");
const router = express.Router();
const User = require("../models/user");
const Ambulance = require("../models/ambulance");
const Schedule = require("../models/schedule");
const SpeciaRequest = require("../models/specialRequest");

const Contact = require("../models/contact");
const SpecialRequest = require("../models/specialRequest");
const Feedback = require("../models/feedback");
const BookingRequest = require("../models/patientRequest");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
// const jest = require('@jest/globals').jest;

const request = require("request");
router.post("/archive/:id", async (req, res) => {
  try {
    const bookingRequestId = req.params.id;
    // Find the booking request by ID and update its 'archived' field to true
    await BookingRequest.findByIdAndUpdate(bookingRequestId, {
      archived: true,
    });
    res.sendStatus(200); // Respond with success status
  } catch (error) {
    console.error("Error archiving booking request:", error);
    res.sendStatus(500); // Respond with internal server error status
  }
});

router.post("/archiveA/:id", async (req, res) => {
  try {
    const ambulanceId = req.params.id;
    console.log("Received request to archive ambulance with ID:", ambulanceId);

    // Update the ambulance to set archived to true
    const updatedAmbulance = await Ambulance.findByIdAndUpdate(ambulanceId, {
      archived: true,
    });
    console.log("Ambulance updated:", updatedAmbulance);

    // Check if ambulance was found and updated
    if (!updatedAmbulance) {
      console.error("Ambulance not found or could not be updated.");
      return res.sendStatus(404); // Respond with not found status
    }

    // Respond with success status
    return res.sendStatus(200);
  } catch (error) {
    console.error("Error archiving ambulance:", error);
    return res.sendStatus(500); // Respond with internal server error status
  }
});

router.get("/ss", (req, res) => {
  res.send("asmkfm");
});
// for authentication
router.get("/", (req, res) => {
  res.render("indexl");
});
router.get("/forgot-password", (req, res) => {
  res.render("forgetPasswordl"); // Renders the index view
});
router.get("/about", (req, res) => {
  res.render("aboutl"); // Renders the index view
});

// router.get('/contact', (req, res) => {
//   res.render('contactl'); // Renders the index view
//   });
router.get("/service", (req, res) => {
  res.render("servicel"); // Renders the index view
});
router.get("/request", (req, res) => {
  res.render("requestl"); // Renders the index view
});
// router.get('/register', (req, res) => {
//   res.render('registerl'); // Renders the index view
//   });
router.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Create a new Contact object
  const contact = new Contact({
    name,
    email,
    subject,
    message,
  });

  // Save the form data to MongoDB
  contact
    .save()
    .then(() => {
      res.render("contact-success");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error submitting form data");
    });
});

// for testing ♥
// Mock mongoose model


// for testing ♥☻



// Route to handle detailed view of a booking request
// router.get('/booking-requests/:id', async (req, res) => {
//   try {
//       const bookingRequest = await BookingRequest.findById(req.params.id).exec();
//       res.render('bookingRequestDetail', { bookingRequest });
//   } catch (error) {
//       console.error("Error retrieving booking request details:", error);
//       res.status(500).send("Internal server error");
//   }
// });

// Backend route to fetch booking request details
router.get("/booking-requests/:id", async (req, res) => {
  try {
    const bookingRequest = await BookingRequest.findById(req.params.id).exec();
    res.json({ bookingRequest });
  } catch (error) {
    console.error("Error retrieving booking request details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to handle deletion of a booking request
router.delete("/booking-requests/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    await BookingRequest.findByIdAndDelete(req.params.id);
    res.sendStatus(204); // Send a 204 No Content response after successful deletion
  } catch (error) {
    console.error("Error deleting booking request:", error);
    res.status(500).send("Internal server error");
  }
});

// Middleware to check if the user is already logged in
function redirectToDashboardIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // User is logged in, redirect to the appropriate dashboard
    const userRole = req.user.role;
    switch (userRole) {
      case "admin":
        return res.redirect("/adminDashboard");
      case "nurse":
        return res.redirect("/nurseDashboard");
      case "driver":
        return res.redirect("/driverDashboard");
      case "dispatcher":
        return res.redirect("/dispatcherDashboard");
      default:
        return res.status(403).send("Unauthorized");
    }
  } else {
    // User is not logged in, proceed to the login page
    next();
  }
}

// Apply the middleware to the login page route
router.get("/login", redirectToDashboardIfLoggedIn, (req, res) => {
  // Render the login page if the user is not logged in
  res.render("loginl");
});


// login route
router.post("/login", passport.authenticate("local"), (req, res) => {
  if (req.user) {
    if (
      req.headers.accept &&
      req.headers.accept.indexOf("application/json") !== -1
    ) {
      // API request from mobile app
      res.json({
        success: true,
        message: "Authentication successful",
        user: {
          username: req.user.username,
          role: req.user.role,
        },
      });
    } else {
      // Web request
      res.redirect("/dashboard");
    }
  } else {
    if (
      req.headers.accept &&
      req.headers.accept.indexOf("application/json") !== -1
    ) {
      // API request from mobile app
      res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    } else {
      // Web request
      res.redirect("/login");
    }
  }
});
router.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    if (
      req.headers.accept &&
      req.headers.accept.indexOf("application/json") !== -1
    ) {
      // API request from mobile app
      res.status(401).json({ success: false, message: "Unauthorized" });
    } else {
      // Web request
      res.redirect("/login"); // Redirect to login if not authenticated
    }
  } else {
    const userRole = req.user.role;
    if (
      req.headers.accept &&
      req.headers.accept.indexOf("application/json") !== -1
    ) {
      // API request from mobile app
      res.json({
        success: true,
        message: "Authenticated",
        user: {
          username: req.user.username,
          role: req.user.role,
          name: req.user.name, // Add the driver's name here
        },
      });
    } else {
      // Web request
      switch (userRole) {
        case "admin":
          res.render("adminDashboard", { username: req.user.username }); // Render admin dashboard template
          break;
        case "nurse":
          res.render("nurseDashboard", { username: req.user.username }); // Render nurse dashboard template
          break;
        case "driver":
          res.render("driverDashboard", { username: req.user.username }); // Render driver dashboard template
          break;
        case "dispatcher":
          res.render("dispatcherDashboard", { username: req.user.username }); // Render dispatcher dashboard template
          break;
        default:
          res.status(403).send("Unauthorized"); // Handle unauthorized access
      }
    }
  }
});




router.get("/adminDashboard",isAdmin, (req, res) => {
  res.render("adminDashboard"); // Renders the index view
});
router.get("/adminAmbulance",isAdmin, (req, res) => {
  res.render("adminAmbulance"); // Renders the index view
});
router.get("/adminContact", isAdmin,(req, res) => {
  res.render("adminContact"); // Renders the index view
});

// Route to update user details
router.post("/updateUser",isAdmin, async (req, res) => {
  try {
    const { userId, name, mobile_number, username, email, role } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update user details
    user.name = name;
    user.mobile_number = mobile_number;
    user.username = username;
    user.email = email;
    user.role = role;

    // Save the updated user
    await user.save();

    // Redirect to the appropriate dashboard based on the role
    if (role === "dispatcher") {
      res.redirect("adminDispatcher");
    } else if (role === "driver") {
      res.redirect("adminDriver");
    } else if (role === "nurse") {
      res.redirect("adminNurse");
    } else {
      // Handle other roles if needed
      res.status(400).send("Invalid role");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to fetch dispatcher users and render the table
// Route to fetch dispatcher users and render the table
router.get("/adminDispatcher", isAdmin,async (req, res) => {
  try {
    const dispatcherUsers = await User.find({ role: "dispatcher" });
    res.render("adminDispatcher", { users: dispatcherUsers }); // Pass users to the template
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Route to fetch nurse users and render the table
router.get("/adminNurse",isAdmin, async (req, res) => {
  try {
    const nurseUsers = await User.find({ role: "nurse" });
    res.render("adminNurse", { users: nurseUsers });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Route to fetch driver users and render the table
router.get("/adminDriver",isAdmin, async (req, res) => {
  try {
    const driverUsers = await User.find({ role: "driver" });
    res.render("adminDriver", { users: driverUsers });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/adminMap",isAdmin, (req, res) => {
  res.render("adminMap"); // Renders the index view
});
router.get("/adminSettings",isAdmin, (req, res) => {
  res.render("adminSettings"); // Renders the index view
});

// Route to handle updating user details
router.post("/updateUser", isAdmin,async (req, res) => {
  const { name, mobile_number, username, email, role } = req.body;

  try {
    // Find the user by username
    let user = await User.findOne({ username }).maxTimeMS(20000);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.name = name;
    user.mobile_number = mobile_number;
    user.email = email;
    user.role = role;

    // Save updated user
    await user.save();

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to delete a user
router.delete("/deleteUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// for dispatcher isDispatcher
router.get("/dispatcherDashboard", isDispatcher, (req, res) => {
  res.render("dispatcherDashboard"); // Renders the index view
});

// 


router.get("/dispatcherContact", isDispatcher,async(req, res) => {
  const contacts = await Contact.find({});
  res.render("dispatcherContact", { contacts }); // Renders the index view
});
router.get("/dispatcherDispatcher",isDispatcher, (req, res) => {
  res.render("dispatcherDispatcher"); // Renders the index view
});
router.get("/dispatcherMap",isDispatcher, (req, res) => {
  res.render("dispatcherMap"); // Renders the index view
});
router.get("/dispatcherSettings",isDispatcher, (req, res) => {
  res.render("dispatcherSettings"); // Renders the index view
});

// older
// router.post('/add-ambulance', async (req, res) => {
//   try {
//     const { type, available } = req.body;
//     const ambulance = new Ambulance({ type, available });
//     await ambulance.save();
//     res.status(201).json({ message: 'Ambulance added successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// new
router.post("/add-ambulance", isDispatcher,async (req, res) => {
  try {
    const { type, available, driver } = req.body;

    // Create ambulance with provided type and availability
    const newAmbulance = new Ambulance({
      type,
      available,
      driver, // Associate the selected driver with the ambulance
    });

    // Save the ambulance
    await newAmbulance.save();

    res.send("Ambulance registered successfully.");
  } catch (error) {
    console.error("Error registering ambulance:", error);
    res.status(400).send(error.message);
  }
});

// Route to get the list of registered drivers
router.get("/get-drivers",isDispatcher, async (req, res) => {
  try {
    // Find all users with role 'driver'
    const drivers = await User.find({ role: "driver" }, "name");

    console.log("Fetched drivers:", drivers); // Log the fetched drivers

    // Send the list of drivers as a JSON response
    res.json(drivers);
  } catch (error) {
    // Handle errors
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route to update an ambulance
router.post("/updateAmbulance",isDispatcher, async (req, res) => {
  try {
    const { ambulanceId, type, available } = req.body;

    // Find the ambulance by ID and update its details
    const updatedAmbulance = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      { type, available },
      { new: true }
    );

    // Send the updated ambulance object in the response
    res.redirect("dispatcherAmbulance");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// retrieve ambulance data
// Route to fetch ambulance information

// DELETE ambulance route
router.delete("/deleteAmbulance/:ambulanceId", async (req, res) => {
  try {
    const { ambulanceId } = req.params;
    await Ambulance.findByIdAndDelete(ambulanceId);
    res.status(200).json({ message: "Ambulance deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/dispatcherAmbulance", isDispatcher,async (req, res) => {
  try {
    // Find ambulances that are not archived
    const ambulances = await Ambulance.find({ archived: false }).populate(
      "driver",
      "name"
    );

    // Fetch all booking requests
    const bookingRequests = await BookingRequest.find().exec();

    // Render the dispatcherAmbulance template with the retrieved data
    res.render("dispatcherAmbulance", { ambulances, bookingRequests });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

router.get("/patientRequest", isDispatcher, async (req, res) => {
  try {
    const ambulances = await Ambulance.find();
    const bookingRequests = await BookingRequest.find({ archived: false });
    res.render("patientRequest", { ambulances, bookingRequests }); // Render the ambulances using a template engine
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle detailed view of a booking request
router.get("/booking-requests/:id", async (req, res) => {
  try {
    const bookingRequest = await BookingRequest.findById(req.params.id).exec();
    res.render("bookingRequestDetail", { bookingRequest });
  } catch (error) {
    console.error("Error retrieving booking request details:", error);
    res.status(500).send("Internal server error");
  }
});

// Route to delete a booking request
router.delete("/booking-requests/:id", async (req, res) => {
  try {
    const bookingRequestId = req.params.id;
    await BookingRequest.findByIdAndDelete(bookingRequestId);
    res.sendStatus(200); // Send success status if deletion is successful
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "miratuujaallataa@gmail.com",
    pass: "pxgb aoed olkr sjuv",
  },
});
// // Express.js routes
// Function to save admin user to the database
// Route for user registration (accessible only to admin) isAdmin
// router.get("/register", (req, res) => {
//   res.render("register"); // Render registration form
// });

// Route to handle user update form submission
// Route to handle user registration form submission
// isAdmin,
router.post("/register", isAdmin, async (req, res) => {
  try {
    const { username, email, role, name, mobile_number, fcmToken } = req.body;

    if (!username || !email || !role || !mobile_number || !name) {
      return res.status(400).send("Please provide all required fields");
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    }).maxTimeMS(20000);
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const randomPassword = crypto.randomBytes(8).toString("hex"); // Generate random password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      name,
      mobile_number,
      fcmToken, // Save the FCM token here
      passwordChanged: false,
    });

    await newUser.save();
    console.log(req.user);

    const changePasswordURL = `http://${req.headers.host}/change-password/${newUser._id}`;

    const mailOptions = {
      from: "miratuujaallataa@gmail.com",
      to: email,
      subject: "Password Change Required",
      text: `Please click the following link to change your password: ${changePasswordURL}`,
      html: `Please click the following link to change your password: <a href="${changePasswordURL}">${changePasswordURL}</a>`,
    };
    await transporter.sendMail(mailOptions);

    res.status(201).render("userRegistered");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// the following for the password reset
router.get("/change-password/:userId", (req, res) => {
  const userId = req.params.userId;
  res.render("changePassword", { userId });
});
router.post("/change-password/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Update the user's password
    user.password = hashedPassword;
    user.passwordChanged = true;
    await user.save();

    res.status(200).send("Password changed successfully");
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Internal Server Error");
  }
});

// reset password logic here
// Route for handling forgot password request
// router.get('/forgot-password', (req, res) => {
//   res.render('forgotPassword');
// });

// Route to handle forgot password form submission
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    // Generate a random token
    const token = crypto.randomBytes(20).toString("hex");
    // Find the user by email
    const user = await User.findOne({ email }).maxTimeMS(20000);
    if (!user) {
      // User not found with that email
      if (req.accepts("html")) {
        // Respond with a simple text message for web clients
        return res.status(404).send("User not found");
      } else {
        // Respond with JSON for API clients (e.g., mobile app)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }
    // Set the reset token and expiration time
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    // Save the user with the reset token
    await user.save();

    // Send email to the user with a link to reset password
    const resetPasswordURL = `http://${req.headers.host}/reset-password/${token}`;
    const mailOptions = {
      from: "miratuujaallataa@gmail.com",
      to: email,
      subject: "Password Reset",
      text:
        "You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        resetPasswordURL +
        "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    };
    await transporter.sendMail(mailOptions);

    if (req.accepts("html")) {
      // Redirect to a confirmation message for web clients
      res.render("email-success ");
    } else {
      // Respond with JSON for API clients (e.g., mobile app)
      res.json({ success: true, message: "Password reset email sent!" });
    }
  } catch (error) {
    console.error("Error sending password reset email:", error);
    if (req.accepts("html")) {
      // Respond with a simple text message for web clients
      res.status(500).send("Internal Server Error");
    } else {
      // Respond with JSON for API clients (e.g., mobile app)
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
});

// Route for handling password reset form
router.get("/reset-password/:token", async (req, res) => {
  try {
    const token = req.params.token;
    // Find the user with the provided token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).maxTimeMS(20000);
    if (!user) {
      // Token is invalid or has expired
      return res.status(400).send("Invalid or expired token");
    }

    // Render the reset password form
    res.render("resetPassword", { token });
  } catch (error) {
    console.error("Error rendering reset password form:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    // Find the user with the provided token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).maxTimeMS(20000);
    if (!user) {
      // Token is invalid or has expired
      return res.status(400).send("Invalid or expired token");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Update the user's password and remove the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Redirect to login page with success message
    res.redirect("/login");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send("Internal Server Error");
  }
});

// retirved archieved
// Route to render archived booking requests
router.get("/ArchivedPatientRequest", async (req, res) => {
  try {
    // Find all archived booking requests
    const archivedRequests = await BookingRequest.find({ archived: true });
    res.render("ArchivedPatientRequest", { archivedRequests }); // Pass the data to the template
  } catch (error) {
    console.error("Error fetching archived booking requests:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/dispatcherAmbulance", async (req, res) => {
  try {
    // Find all archived booking requests
    const archivedRequests = await BookingRequest.find({ archived: true });
    res.render("dispatcherAmbulance", { archivedRequests }); // Pass the data to the template
  } catch (error) {
    console.error("Error fetching archived booking requests:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/ArchivedAmbulance", async (req, res) => {
  try {
    // Fetch archived ambulances from the database
    const archivedAmbulances = await Ambulance.find({
      archived: true,
    }).populate("driver");
    // Render the ArchivedAmbulance.ejs file and pass the archived ambulances data to it
    res.render("ArchivedAmbulance", { ambulances: archivedAmbulances });
  } catch (error) {
    console.error("Error fetching archived ambulances:", error);
    res.status(500).send("Internal Server Error"); // Respond with internal server error status
  }
});

const admin = require("firebase-admin");
const serviceAccount = require("../env/ambulancebooking-812cd-firebase-adminsdk-nlrl0-62836b8b07.json");
const { log } = require("console");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post("/patientRequest", async (req, res) => {
  try {
    const { patient_condition,location, contactInfo, emergency_type, number,address} = req.body;

    // Function to determine the level based on emergency_type
function determineLevel(emergencyType) {
  switch (emergencyType) {
    case 'Animal':
      return 'low';
    case 'Labour':
      return 'medium';
    case 'Car':
      return 'high';
    default:
      return 'low'; // Default level if none of the cases match
  }
}
    const bookingRequest = new BookingRequest({
      location,        // This will use the value from the 'location' variable
      contactInfo,     // This will use the value from the 'contactInfo' variable
      address,         // This will use the value from the 'address' variable
      emergency_type,  // This will use the value from the 'emergency_type' variable
      number,
      patient_condition,          // This will use the value from the 'number' variable
      level: determineLevel(emergency_type), // Set level based on emergency_type
       // Default value set as 'low'
      // createdAt and archived fields will automatically be set to their default values
    });

    const savedRequest = await bookingRequest.save();

    // Send the response yimmediately after saving the request
    res.status(200).json({
      message: "Booking request submitted successfully",
      data: savedRequest,
    });

    // Route to handle archiving a booking request

    // Retrieve all users who should be notified
    const usersToNotify = await User.find({ role: "dispatcher" }); // Adjust the query to match your needs

    // Check if there are users to notify
    if (usersToNotify.length > 0) {
      // Create an array to hold all the tokens
      const tokens = usersToNotify
        .map((user) => user.fcmTokens)
        .flat()
        .filter((token) => token != null);

      // Check if there are valid tokens
      if (tokens.length > 0) {

        const message = {
          data: {
            title: "New Ambulance Request",
            body: "A new ambulance request has been received.",
          },
          tokens: tokens, // Array of FCM tokens
        };

        admin
          .messaging()
          .sendMulticast(message)
          .then((response) =>
            console.log("Notifications sent successfully:", response)
          )
          .catch((error) =>
            console.error("Error sending notifications:", error)
          );
      }
    }
  } catch (error) {
    console.error("Error submitting booking request:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "An internal server error occurred" });
    }
  }
});




router.post('/special-requests', async (req, res) => {
  try {
    const { requestText } = req.body;
    const newRequest = new SpecialRequest({ requestText });
    await newRequest.save();
    res.status(201).json({ message: 'Request saved successfully' });

    // Retrieve all users who should be notified
    const usersToNotify = await User.find({ role: "dispatcher" }); // Adjust the query to match your needs

    // Check if there are users to notify
    if (usersToNotify.length > 0) {
      // Create an array to hold all the tokens
      const tokens = usersToNotify
        .map((user) => user.fcmTokens)
        .flat()
        .filter((token) => token != null);

      // Check if there are valid tokens
      if (tokens.length > 0) {
        const message = {
          data: {
            title: "New Special Request",
            body: "A new special request has been submitted.",
          },
          tokens: tokens, // Array of FCM tokens
        };

        admin
          .messaging()
          .sendMulticast(message)
          .then((response) =>
            console.log("Notifications sent successfully:", response)
          )
          .catch((error) =>
            console.error("Error sending notifications:", error)
          );
      }
    }
  } catch (error) {
    console.error("Error handling special request:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});













router.post("/registerToken", (req, res) => {
  const { token } = req.body;
  // const { token } = req.body;
  console.log("Received token:", token); // Log the received token
  if (req.isAuthenticated()) {
    User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { fcmTokens: token } },
      { new: true }
    )
      .then((user) => {
        res.status(200).send("Token updated successfully");
      })
      .catch((err) => {
        console.error("Error updating token:", err);
        res.status(500).send("Error updating token");
      });
  } else {
    res.status(401).send("User not authenticated");
  }
});

// archived patient request



// Middleware to check the schedule conditions


router.post("/schedule", async (req, res) => {
  try {
    const { ambulance, driver, nurse, pickupTime, dayOfWeek, shift } = req.body;

    // Define the maximum number of schedules allowed per shift
    const maxSchedulesPerShift = 3;

    // Check the number of existing non-archived schedules for the given dayOfWeek and shift
    const existingSchedulesCount = await Schedule.countDocuments({
      dayOfWeek,
      shift,
      archived: false // Only count schedules that are not archived
    });

    // If the number of existing non-archived schedules is less than the maximum, or if the schedule is to be archived, proceed with creating a new schedule
    if (existingSchedulesCount < maxSchedulesPerShift || req.body.archived) {
      // Create a new schedule entry
      const newSchedule = new Schedule({
        ambulance,
        driver,
        nurse,
        pickupTime,
        dayOfWeek,
        shift,
        archived: req.body.archived || false // Set the archived status based on the request, defaulting to false
      });

      // Save the new schedule entry to the database
      await newSchedule.save();

      // Redirect to a page to view scheduled bookings or send a success message
      res.redirect("/schedule");
    } else {
      // If the maximum number of non-archived schedules is reached, send an error message
      // console.log(req.body); // Add this line just before the error response is sent
       res.render('schedule', { error: "limitReached" });

      res.status(400).send("Maximum number of active schedules reached for this shift on the selected day.");    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});








router.get("/schedule", async (req, res) => {
  try {
    // Fetch all necessary data in one go
    const ambulances = await Ambulance.find();
    const drivers = await User.find({ role: "driver" });
    const nurses = await User.find({ role: "nurse" });
    // const schedules = await Schedule.find().populate("ambulance driver nurse");
    const schedules = await Schedule.find({ archived:false }).populate("ambulance driver nurse");


    // Pass all the data to the 'schedule' template
    res.render("schedule", { ambulances, drivers, nurses, schedules });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/archivedSchedule", async (req, res) => {
  try {
    // Fetch all necessary data in one go
    const ambulances = await Ambulance.find();
    const drivers = await User.find({ role: "driver" });
    const nurses = await User.find({ role: "nurse" });
    // const schedules = await Schedule.find().populate("ambulance driver nurse");
    const schedules = await Schedule.find({ archived:true }).populate("ambulance driver nurse");
    // Pass all the data to the 'schedule' template
    res.render("ArchivedSchedule", { ambulances, drivers, nurses, schedules });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// archive schedule
router.post('/archiveSchedule/:id', async (req, res) => {
  try {
      const { id } = req.params;
      await Schedule.findByIdAndUpdate(id, { archived: true });
      res.redirect('/ArchivedSchedule'); // Redirect to the schedules page or wherever you want
  } catch (error) {
      console.error('Error archiving the schedule:', error);
      res.status(500).send('Server error');
  }
});
// archive schedule



// contact retrieve

// contact retrieve☻

// for sms notifications

// for s☻ms notifications
router.post("/dispatch/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate("driver").populate("nurse");
    if (!schedule) {
      return res.status(404).send("Schedule not found");
    }
    // Dispatch logic here

    // Check if schedule has a driver
    if (schedule.driver||schedule.nurse) {
      // Redirect to the smsmessage page with the driver's mobile number and the schedule ID
      console.log(schedule.nurse.mobile_number);
      res.redirect(
        `/smsmessage?mobile_number=${schedule.driver.mobile_number}&nmobile_number=${schedule.nurse.mobile_number}&scheduleId=${schedule._id}`
      );
    } else {
      // If no driver assigned, handle accordingly (e.g., redirect with a message)
      res.redirect("/smsmessage?mobile_number=No%20mobile_number%20assigned");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// router.get('/smsmessage', (req, res) => {
//   const driverName = req.query.driverName;
//   res.render('smsmessage', { driverName });
// });
router.get("/smsmessage", async (req, res) => {
  try {
    const mobile_number = req.query.mobile_number;
    const nmobile_number=req.query.nmobile_number;
    const scheduleId = req.query.scheduleId; // Retrieve the scheduleId from the query parameters
    
    const bookingRequests = await BookingRequest.find({ archived: false });
    // const bookingRequests = await BookingRequest.find({ archived: false });
    // Pass the scheduleId along with other data to the view
    res.render("smsmessage", { bookingRequests, mobile_number, nmobile_number,scheduleId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// hahusms
router.post("/send-sms", async (req, res) => {
  // const apiSecret = "90adae5bf84b095a6ce3acbe357e3c8ee18cc06b"; // Mire API secret
  const apiSecret= "45d69c92f73964d7d741c186f9cd71907713dab3";// Sami API secret
  const recipientNumbers = req.body.recipients
    .split(",")
    .map((number) => number.trim()); // Extract recipient numbers from the form and split by comma
  const messageText = req.body.messageText;
  const scheduleId = req.body.scheduleId; // You'll need to pass this from your form
  // const bookingRequestId = req.body.bookingRequestId; // You'll need to pass this from your form

  // Array to store promises for each SMS sending request
  const sendRequests = recipientNumbers.map((recipientNumber) => {
    return new Promise((resolve, reject) => {
      request.post(
        {
          url: "https://hahu.io/api/send/sms",
          qs: {
            secret: apiSecret,
            mode: "devices",
            //  device: "00000000-0000-0000-b983-bc43e57968e9", // Mire device ID
            devicce:"78282884-a511-998c-3568-741020842078", // Sami device ID
            sim: 1,
            priority: 1,
            phone: recipientNumber,
            message: messageText,
          },
        },
        (error, response, body) => {
          if (error) {
            console.error("Error sending SMS to", recipientNumber, ":", error);
            reject(error);
          } else {
            console.log("SMS sent successfully to", recipientNumber, ":", body);
            resolve(body);
          }
        }
      );
    });
  });

  try {
    // Wait for all SMS sending operations to complete
    const results = await Promise.all(sendRequests);

    // Update the dispatched field after all messages are sent
    await Schedule.findByIdAndUpdate(scheduleId, {
      dispatched: true,
    });



        // Retrieve the bookingRequestId from the form submission
        // const bookingRequestId = req.body.bookingRequestId;
        const bookingRequestId = await BookingRequest.findOne({
          status: false,
          archived: false
        }).sort('createdAt');
        // Update the status of the BookingRequest to true
        await BookingRequest.findByIdAndUpdate(bookingRequestId, {
          status: true,
        });
    

    res.render('smsSuccess')
  } catch (error) {
    console.error("Error during SMS sending or schedule updating:", error);
    res.status(500).json({ error: "Failed to send all SMS or update schedule" });
  }
});


// hahusms

// for sms notifications

// for sms notifications


// feedback
// Route to handle POST request
router.post('/submit-feedback', async (req, res) => {  
  console.log('Request received:', req.body); // Log the incoming request body


  try {
    const { contactNumber, feedbackType, feedbackText } = req.body;

    // Create a new feedback document
    const newFeedback = new Feedback({
      contactNumber,
      feedbackType,
      feedbackText,
    });

    // Save the feedback to the database
    await newFeedback.save();

    res.status(201).send('Feedback submitted successfully');
  } catch (error) {
    console.error('Error occurred:', error); // Log any errors

    res.status(500).send('Error submitting feedback');
  }
});


// router.get("/scheduleNurseAndDriver", function (req, res) {
//   req.logout(function (err) {
//     if (err) {
//       console.error("Error logging out:", err);
//       return res.status(500).send("Internal server error");
//     }
//     // Redirect the user to the login page after successful logout
//     res.redirect("/login");
//   });
// });

router.get("/scheduleNurseAndDriver", async (req, res) => {
  try {
    // Fetch all necessary data in one go
    const ambulances = await Ambulance.find();
    const drivers = await User.find({ role: "driver" });
    const nurses = await User.find({ role: "nurse" });
    // const schedules = await Schedule.find().populate("ambulance driver nurse");
    const schedules = await Schedule.find({ archived:false }).populate("ambulance driver nurse");


    // Pass all the data to the 'schedule' template
    res.render("scheduleNurseAndDriver", { ambulances, drivers, nurses, schedules });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// scheduleNurseAndDriver
// feedback
// Route to Log out
router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Internal server error");
    }
    // Redirect the user to the login page after successful logout
    res.redirect("/login");
  });
});

// testing 
router.get("/specialRequestPage", async function (req, res) {
  try {
    const requests = await SpecialRequest.find();
    res.render('specialRequestPage', { requests: requests });
  } catch (error) {
    res.status(500).send(error);
  }
});

// 
router.get("/x", async function (req, res) {
  res.render('smsSuccess')
});
module.exports = router;
