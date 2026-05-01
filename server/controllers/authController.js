// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // REGISTER
// export const register = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     // 🔐 basic validation
//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ msg: "All fields are required" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ msg: "Password must be at least 6 characters" });
//     }

//     // 🔍 check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     // 🔐 hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 💾 create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role
//     });

//     // ✅ response (NO PASSWORD)
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role
//     });

//   } catch (err) {
//     res.status(500).json({ msg: "Registration failed" });
//   }
// };


// // LOGIN
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // 🔍 find user
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     // 🔐 check password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid password" });
//     }

//     // 🎟️ generate token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // ✅ response
//     res.json({
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (err) {
//     res.status(500).json({ msg: "Login failed" });
//   }
// };




import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";


// 🔥 ZOD SCHEMAS
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["patient", "doctor"])
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password required")
});


// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    // ✅ ZOD VALIDATION
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        msg: parsed.error.errors[0].message
      });
    }

    const { name, email, password, role } = parsed.data;

    // 🔍 check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // ✅ response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch {
    res.status(500).json({ msg: "Registration failed" });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    // ✅ ZOD VALIDATION
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        msg: parsed.error.errors[0].message
      });
    }

    const { email, password } = parsed.data;

    // 🔍 find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // 🔐 check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // 🎟️ generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ response
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch {
    res.status(500).json({ msg: "Login failed" });
  }
};