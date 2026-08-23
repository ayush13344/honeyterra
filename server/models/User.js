import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // ==========================================
    // PHONE
    // ==========================================

    phone: {
      type: String,
      trim: true,
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

userSchema.pre("save", async function (next) {
  // If password has not changed,
  // don't hash it again.

  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );

    next();
  } catch (error) {
    next(error);
  }
});


// ==========================================
// COMPARE PASSWORD
// ==========================================

userSchema.methods.comparePassword = async function (
  enteredPassword
) {
  return await bcrypt.compare(
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