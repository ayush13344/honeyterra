import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ==========================================
// ADDRESS SCHEMA
// ==========================================

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

// ==========================================
// USER SCHEMA
// ==========================================

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // NAME
    // ==========================================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
    },

    // ==========================================
    // EMAIL
    // ==========================================

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ==========================================
    // PASSWORD
    // ==========================================
    // Required for normal accounts.
    // Not required for Google accounts.

    password: {
      type: String,
      minlength: 6,
      select: true,
    },

    // ==========================================
    // GOOGLE ID
    // ==========================================

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // ==========================================
    // AUTH PROVIDER
    // ==========================================

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // ==========================================
    // PROFILE IMAGE
    // ==========================================

    avatar: {
      type: String,
      default: "",
    },

    // ==========================================
    // PHONE
    // ==========================================

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // ROLE
    // ==========================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ==========================================
    // ADDRESSES
    // ==========================================

    addresses: {
      type: [addressSchema],
      default: [],
    },

    // ==========================================
    // ACTIVE STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// HASH PASSWORD BEFORE SAVE
// ==========================================

userSchema.pre("save", async function () {
  // Google users don't have a password.
  if (!this.password) {
    return;
  }

  // Password has not changed.
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );
  } catch (error) {
    throw error;
  }
});

// ==========================================
// COMPARE PASSWORD
// ==========================================

userSchema.methods.comparePassword = async function (
  enteredPassword
) {
  // Google accounts don't have a local password.
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

// ==========================================
// MODEL
// ==========================================

const User = mongoose.model(
  "User",
  userSchema
);

export default User;