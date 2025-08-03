






















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
