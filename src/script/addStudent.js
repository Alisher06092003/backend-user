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
         
            // Formani tozalash
            
            
          
            
            // O'zgarishi mumkin
        } else {
           
        }
   
       
        
    }
});

