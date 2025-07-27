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
   

   