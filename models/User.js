import mongoos from 'mongoose';

const UserSchema = new mongoos.Schema(
    {
        _id: {type: String, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true},
        image: {type: String, required: false},
    },
    { timestamps: true }
)

const User = mongoos.models.User || mongoos.model("User", UserSchema);

export default User;