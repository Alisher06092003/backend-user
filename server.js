import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import Student from "./models/student.js";

const app = express();
const port = 7777;

app.use(express.json());
app.use(cors());

// 🛠 **MongoDB ga ulanish!**
mongoose.connect('mongodb://127.0.0.1:27017/schoolDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ MongoDB muvaffaqiyatli ulandi!");
})
.catch((error) => {
    console.error("❌ MongoDB ulanishida xatolik:", error);
});

// **API - O‘quvchini qo‘shish (POST)**
app.post('/api/students', async (req, res) => {
    try {
        const lastUser = await Student.find().sort({ userId: -1 }).limit(1);
        const newUserId = lastUser.length > 0 ? lastUser[0].userId + 1 : 1;

        const newStudent = new Student({
            userId: newUserId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone1: req.body.phone1,
            phone2: req.body.phone2,
            group: req.body.group
        });

        await newStudent.save();
        res.status(201).json({ message: `✅ Foydalanuvchi qo‘shildi: ID ${newUserId}`, student: newStudent });
    } catch (error) {
        console.error(error); // Xatolikni konsolga chiqarish
        res.status(500).json({ message: "❌ Xatolik yuz berdi!", error });
    }
});

// **API - O‘quvchi ro‘yxatini olish (GET)**
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Xatolik yuz berdi!" });
    }
});

// Indekslangan foydalanuvchilarni JSON formatida qaytaradi
app.get("/api/users", async (req, res) => {
    try {
        const users = await usersCollection.find().toArray();

        // ✅ Foydalanuvchilarga indeks berish
        const indexedUsers = users.map((user, index) => ({
            index: index + 1,  // ✅ 1 dan boshlab indeks qo‘shish
            ...user            // ✅ Barcha ma’lumotlarni saqlash
        }));

        res.json(indexedUsers); // 🟢 Indeks bilan qaytarish
    } catch (error) {
        console.error("❌ Xatolik:", error);
        res.status(500).json({ error: "Ichki server xatosi!" });
    }
});

// **Serverni ishga tushirish**
app.listen(port, () => {
    console.log(`✅ Server ishlayapti: http://localhost:${port}`);
});


// **Foydalanuvchini O'chirish (DELETE)**
app.delete("/api/students/:id", async (req, res) => {
    try {
        const studentId = req.params.id;
        await Student.deleteOne({ _id: new mongoose.Types.ObjectId(studentId) });
        res.json({ message: "✅ Talaba muvaffaqiyatli o'chirildi!" });
    } catch (error) {
        console.error("❌ Xatolik:", error);
        res.status(500).json({ message: "Ichki server xatosi!" });
    }
});



















