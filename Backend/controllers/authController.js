import bcrypt from 'bcrypt';
import { db } from '../config/dbClient.js';
import { users } from '../config/schema.js';
import { eq } from 'drizzle-orm';
import { generateToken } from '../utils/generateToken.js';

const validateName = (name) => {
  if (!name || typeof name !== 'string') return false;
  return name.length >= 20 && name.length <= 60;
};

const validateAddress = (address) => {
  // Address is optional, but if provided, check length
  if (!address) return true;
  return address.length <= 400;
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8 || password.length > 16) return false;
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  
  return true;
};

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // Standard email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!validateName(name)) {
      return res.status(400).json({ 
        message: 'Name must be between 20 and 60 characters' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be 8-16 characters with at least one uppercase letter and one special character' 
      });
    }

    if (address && !validateAddress(address)) {
      return res.status(400).json({ 
        message: 'Address cannot exceed 400 characters' 
      });
    }

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || 'user',
    });

    // Fetch the newly created user (MySQL doesn't support RETURNING)
    const newUserResult = await db.select().from(users).where(eq(users.email, email));
    const newUser = newUserResult[0];

    const token = generateToken({ id: newUser.id, role: newUser.role });

    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};




export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  
  if (!validateEmail(email)) {
    return res.status(400).json({ 
      message: 'Please provide a valid email address' 
    });
  }

  if (!password) {
    return res.status(400).json({ 
      message: 'Password is required' 
    });
  }

  const found = await db.select().from(users).where(eq(users.email, email));
  const user = found[0];

  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken({ id: user.id, role: user.role });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    },
    token,
  });
};

export const updateUserPassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.id;

  if (!newPassword) return res.status(400).json({ message: 'New password required' });


  if (!validatePassword(newPassword)) {
    return res.status(400).json({ 
      message: 'Password must be 8-16 characters with at least one uppercase letter and one special character' 
    });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.update(users)
    .set({ password: hashed })
    .where(eq(users.id, userId));

  res.json({ message: 'Password updated successfully' });
};