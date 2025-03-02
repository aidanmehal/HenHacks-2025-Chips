// controllers/userController.js
import User from "../models/User.js"; // your Sequelize User model

/**
 * Create a new user account
 * @route POST /api/users/register
 */
export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    
    // Optionally, check if user already exists:
    // const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) return res.status(400).json({ error: "Email in use" });

    // Create new user in DB
    const newUser = await User.create({
      username,
      email,
      password
      // role defaults to "user", but you can override
    });

    // Return success response
    return res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
