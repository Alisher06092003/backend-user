document.getElementById("saveButton").addEventListener("click", async () => {
    const studentData = {
        firstName: document.getElementById("grid-first-name").value.trim(),
        lastName: document.getElementById("grid-last-name").value.trim(),
        phone1: document.getElementById("phone1").value,
        phone2: document.getElementById("phone2").value,
        group: document.getElementById("grid-state").value
    };

    // Maydonlarni tekshirish
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

       
    }
});

