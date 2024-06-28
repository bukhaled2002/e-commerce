const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please provide first name"],
      minlength: [2, "please provide valid name"],
    },
    lastName: {
      type: String,
      required: [true, "please provide last name"],
      minlength: [2, "please provide valid name"],
    },
    email: {
      type: String, //change with email validator
      required: [true, "please provide a valid email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please provide a valid password"],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, "please provide a valid password confirmation"],
      minlength: 8,
      validate: [
        function (val) {
          this.password === val;
        },
        "the passwords are not the same",
      ],
    },
    passwordChangedAt: { type: Date },
    location: {
      type: String,
      requied: true,
    },
    phoneNumber: {
      type: Number,
      min: 7,
      max: 15,
    },
    role: {
      type: String,
      enums: ["admin", "vendor", "customer"],
      default: "customer",
    },
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    productPurchaced: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    location: String,
    points: Number,
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.correctPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  let changedTimestamp;
  if (this.passwordChangedAt) {
    changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
