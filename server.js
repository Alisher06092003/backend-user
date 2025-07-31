// Eng Assosiy codlar baza bilan ishlash mongodb va postman ulanishlar
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import Student from "./models/student.js";

// Serverni ulash yani korish 
const app = express();
const port = 7777;

// Guruh sxemasi
const groupSchema = new mongoose.Schema({ 
    name: { 
        type: String, 
        required: true,  
        unique: true    
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Guruh modelini yaratish
const Group = mongoose.model("Group", groupSchema);

app.use(express.json());
app.use(cors());

// MongoDB ga ulanish!
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

// API - O‘quvchini qo‘shish (POST)
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

// API - O‘quvchi ro‘yxatini olish (GET)
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

        // Foydalanuvchilarga indeks berish
        const indexedUsers = users.map((user, index) => ({
            index: index + 1,  // 1 dan boshlab indeks qo‘shish
            ...user            // Barcha ma’lumotlarni saqlash
        }));

        res.json(indexedUsers); // Indeks bilan qaytarish
    } catch (error) {
        console.error("❌ Xatolik:", error);
        res.status(500).json({ error: "Ichki server xatosi!" });
    }
});

// Serverni ishga tushirish
app.listen(port, () => {
    console.log(`✅ Server ishlayapti: http://localhost:${port}`);
});

// Foydalanuvchini O'chirish (DELETE)
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

// Foydalanuvchini Tahrirlash (UPDATE)


// Berilgan IDga ega Foydalanuvchini yangilaydi.
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

// API - Guruh yaratish
app.post("/api/create-group", async (req, res) => {
    try {
        console.log("🔍 Kelayotgan ma’lumot:", req.body); // Kiritilayotgan ma’lumotni tekshirish

        const { name } = req.body;
        const validationError = validateGroupName(name);
        if (validationError) return res.status(400).json({ message: validationError });

        const newGroup = new Group({ name });
        await newGroup.save();

        console.log("✅ Guruh yaratildi:", newGroup); // Guruh to‘g‘ri saqlanganligini tekshirish
        res.json({ message: "✅ Guruh muvaffaqiyatli yaratildi!", group: newGroup });
    } catch (error) {
        console.error("❌ Xatolik:", error);
        res.status(500).json({ message: "❌ Server xatosi!", error: error.message });
    }
});

// Guruh nomini tekshirish funksiyasi
function validateGroupName(name) {
    if (!name || !name.trim()) {
       
    }
    
}

// Guruhlarni Yuklash 
app.get("/api/groups", async (req, res) => {
    try {
        const groups = await Group.find().lean(); 

        const formattedGroups = groups.map(group => {
            const createdAt = new Date(group.createdAt);
            return {
                ...group,
                year: createdAt.getFullYear(),
                month: createdAt.toLocaleString('uz-UZ', { month: 'long' }),
                day: createdAt.getDate(),
                time: createdAt.toLocaleTimeString('uz-UZ', { hour12: false })
            };
        });

        // Sanani "3 June 2025" formatida birlashtirish
        formattedGroups.forEach(group => {
            group.formattedDate = `${group.day} ${group.month} ${group.year}`;
        });

        res.json(formattedGroups);
    } catch (error) {
        console.error("❌ Xatolik:", error);
        res.status(500).json({ message: "❌ Server xatosi!", error: error.message });
    }
});

// Serverdan guruhlar ro'yxatini yuklab, uni jadvalda ko'rsatish.
async function loadGroups() {
    try {
        const response = await fetch("http://127.0.0.1:7777/api/groups");

        if (!response.ok) {
            throw new Error("❌ Guruhlarni olishda xatolik yuz berdi!");
        }

        const groups = await response.json();
        const tbody = document.querySelector("tbody");
        tbody.innerHTML = ""; // Ro'yxatni tozalash

        if (!groups.length) {
            tbody.innerHTML = "<tr><td colspan='7' class='text-center'>❌ Hech qanday guruh topilmadi!</td></tr>";
            return;
        }

        groups.forEach(group => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${group.name}</td>
                <td>${group.formattedDate}</td>
                <td>${group.time}</td>
                <td>
                    <button class="showListBtn">Ro‘yxatni ko‘rish</button>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("❌ Xatolik:", error);
        document.querySelector("tbody").innerHTML = "<tr><td colspan='7'>❌ Guruhlar yuklanmadi!</td></tr>";
    }
}
