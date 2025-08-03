




















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
        return "❌ Guruh nomi kiritilmadi!";
    }
    return null; // Hech qanday xato bo'lmasa null qaytaramiz
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
