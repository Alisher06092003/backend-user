import mongoose from 'mongoose';

// Student schema yaratish
const studentSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone1: { type: String, required: true },
    phone2: { type: String },
    group: { type: String, required: true }
});

// Modelni yaratish
const Student = mongoose.model('Student', studentSchema);

export default Student;