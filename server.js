import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import Student from "./models/student.js";

const app = express();
const port = 7777;

// Guruh modeli
const groupSchema = new mongoose.Schema({ 
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});
const Group = mongoose.model("Group", groupSchema);

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

// **Foydalanuvchini Tahrirlash (UPDATE)**
app.get("/api/students/:id", async (req, res) => {
    try {
        const studentId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "❌ Noto‘g‘ri ID formati!" });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "❌ Foydalanuvchi topilmadi!" });
        }

        res.json(student);
    } catch (error) {
        console.error("❌ Xatolik:", error);
        res.status(500).json({ message: "Ichki server xatosi!" });
    }
});

app.put("/api/students/:id", async (req, res) => {
    try {
        const studentId = req.params.id;
        const updatedData = req.body;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "❌ Noto‘g‘ri ID formati!" });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "❌ Foydalanuvchi topilmadi!" });
        }

        res.json({ message: "✅ Foydalanuvchi muvaffaqiyatli yangilandi!", student: updatedStudent });
    } catch (error) {
        console.error("❌ Xatolik:", error);
        res.status(500).json({ message: "Ichki server xatosi!" });
    }
});


// 📌 2️⃣ API - Guruh yaratish
app.post("/api/create-group", async (req, res) => {
    try {
        console.log("🔍 Kelayotgan ma’lumot:", req.body); // 🔎 Kiritilayotgan ma’lumotni tekshirish

        const { name } = req.body;
        if (!name.trim()) return res.status(400).json({ message: "❌ Guruh nomi kiritilmadi!" });

        const newGroup = new Group({ name });
        await newGroup.save();

        console.log("✅ Guruh yaratildi:", newGroup); // 🔎 Guruh to‘g‘ri saqlanganligini tekshirish
        res.json({ message: "✅ Guruh muvaffaqiyatli yaratildi!", group: newGroup });
    } catch (error) {
        console.error("❌ Xatolik:", error);
        res.status(500).json({ message: "❌ Server xatosi!", error: error.message });
    }
});


app.get("/api/groups", async (req, res) => {
    try {
        const groups = await Group.find().lean();

        // 🕒 Sanani to‘liq formatda chiqarish (Toshkent vaqti)
        const formattedGroups = groups.map(group => ({
            ...group,
            formattedDate: new Intl.DateTimeFormat("uz-UZ", {
                timeZone: "Asia/Tashkent",
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
               
            }).format(new Date(group.createdAt))
        }));

        res.json(formattedGroups);
    } catch (error) {
        console.error("❌ Xatolik:", error);
        res.status(500).json({ message: `❌ Server xatosi: ${error.message}` });
    }
});


















