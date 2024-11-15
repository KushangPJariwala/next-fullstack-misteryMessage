import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  uname: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry:Date;
  isVerified:Boolean,
  isAcceptingMessage:Boolean;
  messages:Message[]
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema: Schema<User> = new Schema({
  uname: {
    type: String,
    required: [true,"Username is required"],
    trim:true,
    unique:true
  },
  email: {
    type: String,
    required: [true,"Email is required"],
    trim:true,
    unique:true,
    match:[/.+\@.+\..+/,'Use valid email']
  },
  password: {
    type: String,
    required: [true,"Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true,"verifyCode is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true,"verifyCode Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default:false
  },
  isAcceptingMessage: {
    type: Boolean,
    default:true
  },
  messages:[MessageSchema]
  
});


const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema) 
// This checks if the User model has already been registered in the Mongoose models cache.
// If mongoose.models.User exists, it will use the cached model.
// If not, it will define and register a new model using mongoose.model<User>("User", UserSchema).

export default UserModel
