import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: [true, "Name is required"],
        trim: true, // removes whitespace
        unique: [true, "Name must be unique"],
    },

    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],

    fileTree: {
        type: Object,
        default: {}
    },

})

const Project = mongoose.model('Project', projectSchema);

export default Project;