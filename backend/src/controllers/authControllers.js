// import { generateToken } from "../config/jwt.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// // For demo, using a simple hardcoded user. In production, validate against database.
// const DEMO_USER = {
//   id: "user123",
//   email: "demo@example.com",
//   password: "demo123" // Never store plain text in production!
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate credentials (in production, query database & use bcrypt)
//     if (email === DEMO_USER.email && password === DEMO_USER.password) {
//       const token = generateToken(DEMO_USER.id);
//       return res.status(200).json({
//         message: "Login successful",
//         token,
//         user: { id: DEMO_USER.id, email: DEMO_USER.email }
//       });
//     }

//     res.status(401).json({ message: "Invalid email or password" });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const register = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // In production: validate input, hash password, save to DB
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     const token = generateToken("new-user-id");
//     res.status(201).json({
//       message: "Registration successful",
//       token,
//       user: { id: "new-user-id", email }
//     });
//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(201).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password)
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(201).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
