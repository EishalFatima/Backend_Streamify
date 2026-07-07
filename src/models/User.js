import mongoose, { Types } from 'mongoose'
import bcrypt, { hash } from "bcryptjs"
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    },
    nativeLanguage: {
        type: String,
        default: ""
    },
    learningLanguag: {
        type: String,
        default: ""
    },
    Location: {
        type: String,
        default: ""
    },
    isOnBoarded: {
        type: Boolean,
        default: false
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},
    { timestamps: true }
)


// pre hook to hash the password so that it cant be hacked
userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next()
try {
    const salt  = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password , salt)
} catch (error) {
     next(error)
}
})

// Comapiring the password the user entered with the hashed password 
userSchema.methods.matchPassword = async function(enteredPassword){
   const isPasswordCorrect = await bcrypt.compare(enteredPassword , this.password)
return  isPasswordCorrect

} 

const User = new mongoose.model("User" , userSchema)

export default User;





