
        



function dropdownFunction(element) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                let list = element.parentElement.parentElement.getElementsByClassName("dropdown-content")[0];
                list.classList.add("target");
                for (i = 0; i < dropdowns.length; i++) {
                    if (!dropdowns[i].classList.contains("target")) {
                        dropdowns[i].classList.add("hidden");
                    }
                }
                list.classList.toggle("hidden");         
            }



// Modal Oyna 
document.querySelector(".showListBtn").addEventListener("click", function () {
    document.getElementById("userModal").classList.remove("hidden");
});

document.getElementById("closeModalBtn").addEventListener("click", function () {
    document.getElementById("userModal").classList.add("hidden");
});










// 📌 3️⃣ Frontend - Guruh nomini kiritish va backendga so‘rov yuborish
document.addEventListener("DOMContentLoaded", function () {
    const dropdownButton = document.getElementById("newButton");
    const groupNameInput = document.getElementById("groupNameInput");

    if (!dropdownButton || !groupNameInput) {
        console.error("❌ newButton yoki groupNameInput topilmadi! HTML-ni tekshiring.");
        return;
    }

    dropdownButton.addEventListener("click", async () => {
        const groupName = groupNameInput.value.trim();

        if (!groupName) {
            alert("❌ Guruh nomini kiritishingiz kerak!");
            return;
        }

     