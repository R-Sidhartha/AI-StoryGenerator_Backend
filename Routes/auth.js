const express = require("express");
const {User} = require("../models/Schemas");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser= require('../middleware/fetchuser')

const jwt_secret = "nevermessagain@#$";

const usernameRegex = /^[a-zA-Z0-9_]+$/;

const validationRules = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 characters"),
  body("UserName").isLength({ min: 5 }).withMessage("UserName should be at least 5 characters").matches(usernameRegex)
  .withMessage("UserName should contain only letters, numbers, and underscores"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
];

//Route-1 : endpoint for creating user 'using POST request ' 
router.post("/createuser", validationRules, async (req, res) => {
  const result = validationResult(req);
  let Success=false;
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  try {
    let user = await User.findOne({ UserName: req.body.UserName });
    if (user) {
      return res
        .status(400)
        .json({ error: "sorry a user with this UserName already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const strongpassword = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      UserName: req.body.UserName,
      password: strongpassword
    });
    const data = {
      id: user.id
    };
    const authtoken = jwt.sign(data, jwt_secret);
    Success=true
    res.json({ Success,authtoken });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});


//Route-2: now let's create endpoints for Users to login 'using POST request'
const loginRules = [
  body("UserName").matches(usernameRegex).withMessage("Enter a valid UserName"),
  body("password").exists().withMessage("Password can not be blank"),
];
router.post("/login", loginRules, async (req, res) => {
  const result = validationResult(req);
  let Success=false;
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  const { UserName, password } = req.body;
  try {
    let user = await User.findOne({ UserName });
    if (!user) {
      return res
        .status(400)
        .json({ error: "please try to login with correct credentials" });
    }
    const passwordcompare = await bcrypt.compare(password, user.password);
    if (!passwordcompare) {
      return res
        .status(400)
        .json({ error: "please try to login with correct credentials" });
    }
    const data = {
      id: user.id,
    };
    const authtoken = jwt.sign(data, jwt_secret);
    Success=true;
    res.json({ Success,authtoken });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});


//Route-3 endpoint for fetching user 'using POST request '
router.post("/getuser", fetchuser, async (req, res) => {
 try {
    const authtoken = req.header('auth-token'); // Get the auth-token from request headers
    if (!authtoken) {
      return res.status(401).json({ error: "No auth-token provided" });
    }
    const decodedToken = jwt.verify(authtoken, jwt_secret); // Verify the token
    const userId = decodedToken.id; // Extract the user id from the decoded token
  const user = await  User.findById(userId).select("-password")
  // console.log(user)
  res.send(user)
  return;
 } catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}
})
module.exports = router;
