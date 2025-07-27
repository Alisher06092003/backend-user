document.getElementById("saveButton").addEventListener("click", async () => {
    const studentData = {
      
       
        
        
        
    };

    // Maydonlarni tekshirish
    if (!studentData.firstName || !studentData.lastName || studentData.group === "Gurux Tanlng") {
        
        return;
    }

    try {
        const response = await fetch("http://localhost:7777/api/students", {
           
           
            
owToast("✅ O‘quvchi muvaffaqiyatli qo‘shildi!", "green");
            // Formani tozalash
            
            
          
            
ch (error) {
     
});


   
   

   