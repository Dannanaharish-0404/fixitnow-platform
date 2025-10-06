const User = require(" ../models/User\);
const bcrypt = require(\bcryptjs\);
const jwt = require(\jsonwebtoken\);

const register = async (req, res) => {
 try {
 const { name, email, password } = req.body;

 if (!name || !email || !password) {
 return res.status(400).json({ message: \Please provide name email and password\ });
 }

 const existingUser = await User.findOne({ email });
 if (existingUser) {
 return res.status(400).json({ message: \User already exists with this email\ });
 }

 const salt = await bcrypt.genSalt(10);
 const hashedPassword = await bcrypt.hash(password, salt);

 const user = new User({
 name,
 email,
 password: hashedPassword
 });

 await user.save();

 const token = jwt.sign(
 { userId: user._id },
 process.env.JWT_SECRET || \your-secret-key\,
 { expiresIn: \7d\ }
 );

 res.status(201).json({
 message: \User registered successfully\,
 token,
 user: { id: user._id, name: user.name, email: user.email }
 });
 } catch (error) {
 console.error(\Registration error:\, error);
 res.status(500).json({ message: \Server error during registration\ });
 }
};

const login = async (req, res) => {
 try {
 const { email, password } = req.body;

 if (!email || !password) {
 return res.status(400).json({ message: \Please provide email and password\ });
 }

 const user = await User.findOne({ email });
 if (!user) {
 return res.status(400).json({ message: \Invalid credentials\ });
 }

 const isMatch = await bcrypt.compare(password, user.password);
 if (!isMatch) {
 return res.status(400).json({ message: \Invalid credentials\ });
 }

 const token = jwt.sign(
 { userId: user._id },
 process.env.JWT_SECRET || \your-secret-key\,
 { expiresIn: \7d\ }
 );

 res.json({
 message: \Login successful\,
 token,
 user: { id: user._id, name: user.name, email: user.email }
 });
 } catch (error) {
 console.error(\Login error:\, error);
 res.status(500).json({ message: \Server error during login\ });
 }
};

const getCurrentUser = async (req, res) => {
 try {
 const user = await User.findById(req.user.userId).select(\-password\);
 res.json(user);
 } catch (error) {
 res.status(500).json({ message: \Server error\ });
 }
};

const updateProfile = async (req, res) => {
 try {
 const updates = req.body;
 const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select(\-password\);
 res.json(user);
 } catch (error) {
 res.status(500).json({ message: \Server error\ });
 }
};

module.exports = { register, login, getCurrentUser, updateProfile };
