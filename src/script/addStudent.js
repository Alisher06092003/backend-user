document.getElementById("saveButton").addEventListener("click", async () => {
    const studentData = {
      
       
        
        
        
    };

    // Maydonlarni tekshirish
    if (!studentData.firstName || !studentData.lastName || studentData.group === "Gurux Tanlng") {
        
        return;
    }

    try {
        const response = await fetch("http://localhost:7777/api/students", {
           
           
            
        });

        if (response.ok) {
            showToast("✅ O‘quvchi muvaffaqiyatli qo‘shildi!", "green");
            // Formani tozalash
            
            
          
            
            document.getElementById("grid-state").value = 'Gurux Tanlng'; // O'zgarishi mumkin
        } else {
            showToast("❌ Xatolik yuz berdi!", "red");
        }
    } catch (error) {
        console.error("Serverga so‘rov yuborishda xatolik:", error);
        showToast("⚠️ Ulanish xatosi!", "red");
    }
});

// Toast xabarini chiqarish funksiyasi
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



async function handleGroupCreation() {
    const groupName = groupNameInput.value.trim();

    if (!validateInput(groupName) || selectedUsers.length === 0) {
      
       
    }

    try {
        const response = await createGroup(groupName, selectedUsers);
        await handleResponse(response);
        groupNameInput.value = ""; // Inputni tozalash
        selectedUsers = []; // Tanlangan foydalanuvchilarni tozalash
        loadGroups(); // Ro'yxatni yangilash
    } catch (error) {
        console.error("❌ Xatolik:", error);
        alert("❌ Guruh yaratishda muammo yuz berdi!");
    }
}

// Guruh yaratish uchun serverga so'rov yuborish
async function createGroup(groupName, members) {
    const response = await fetch("http://127.0.0.1:7777/api/create-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: groupName, members }) // Tanlangan foydalanuvchilarni qo'shish
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server xatosi!");
    }
    return response;
}