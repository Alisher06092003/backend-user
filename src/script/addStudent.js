document.getElementById("saveButton").addEventListener("click", async () => {
    const studentData = {
        firstName: document.getElementById("grid-first-name").value.trim(),
        lastName: document.getElementById("grid-last-name").value.trim(),
        phone1: document.getElementById("phone1").value,
        phone2: document.getElementById("phone2").value,
        group: document.getElementById("grid-state").value
    };

    if (!studentData.firstName || !studentData.lastName || studentData.group === "Gurux Tanlng") {
        showToast("❌ Barcha maydonlarni to‘ldiring!", "red");
        return;
    }

    try {
        const response = await fetch("http://localhost:7777/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            showToast("✅ O‘quvchi muvaffaqiyatli qo‘shildi!", "green");
        } else {
            showToast("❌ Xatolik yuz berdi!", "red");
        }
    } catch (error) {
        console.error("Serverga so‘rov yuborishda xatolik:", error);
        showToast("⚠️ Ulanish xatosi!", "red");
    }
});

// ✅ **Toast xabarni chiqarish funksiyasi**
function showToast(message, color) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add(`bg-${color}-500`);

    setTimeout(() => {
        toast.classList.add("hidden");
        toast.classList.remove(`bg-${color}-500`);
    }, 3000); // 3 sekunddan so‘ng yashirin bo‘ladi
}

