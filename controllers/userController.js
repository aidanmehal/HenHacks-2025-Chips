import User from "../models/User.js";

/**
 * Create a new user account
 * @route POST /api/users/register
 */
export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    
    const newUser = await User.create({
      username,
      email,
      password
    });

    
    return res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
