






















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


