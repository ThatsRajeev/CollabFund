import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  address: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  avatar: { type: String },
},
{ timestamps: true }
);

userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
userSchema.set('toJSON',{
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {delete ret._id}
})

const User = mongoose.model('User3', userSchema);
export default User;
