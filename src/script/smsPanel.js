
        



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

        try {
            console.log("🚀 Guruh yaratish so‘rovi yuborildi:", groupName);

            const response = await fetch("http://127.0.0.1:7777/api/create-group", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: groupName })
            });

            const rawData = await response.text();
            console.log("🔍 Serverdan kelayotgan javob:", rawData);

            let data;
            try {
                data = JSON.parse(rawData);
            } catch (error) {
                console.error("❌ Server noto‘g‘ri JSON qaytardi!");
                alert("❌ Server noto‘g‘ri javob qaytardi!");
                return;
            }

            if (!response.ok) {
                alert(`❌ ${data.message || "Server xatosi!"}`);
                return;
            }

            alert(`✅ Guruh yaratildi: ${data.message}`);
            groupNameInput.value = ""; // 🛠 **Inputni tozalash**
            loadGroups(); // 🔄 **Ro‘yxatni darhol yangilash**
        } catch (error) {
            console.error("❌ Xatolik:", error);
            alert("❌ Guruh yaratishda muammo yuz berdi!");
        }
    });
});




async function loadGroups() {
    try {
        console.log("🚀 Guruhlar ro‘yxatini yuklash...");
        const response = await fetch("http://127.0.0.1:7777/api/groups");

        if (!response.ok) {
            throw new Error("❌ Guruhlarni olishda xatolik yuz berdi!");
        }

        const groups = await response.json();
        console.log("✅ Olingan guruhlar:", groups);

        const tbody = document.querySelector("tbody"); // 🛠 **Jadvalni topamiz**
        tbody.innerHTML = ""; // 🔄 **Avvalgi ro‘yxatni tozalash**

        if (!groups.length) {
            tbody.innerHTML = "<tr><td colspan='7' class='text-center'>❌ Hech qanday guruh topilmadi!</td></tr>";
            return;
        }

        groups.forEach(group => {
            const row = document.createElement("tr");
            row.className = "h-16 border border-gray-100 rounded";
            row.innerHTML = `
                <td>
                    <div class="ml-5">
                        <div class="bg-gray-200 rounded-sm w-5 h-5 flex justify-center items-center relative">
                            <input type="checkbox" class="checkbox opacity-0 absolute cursor-pointer w-full h-full" />
                            <div class="check-icon hidden bg-indigo-700 text-white rounded-sm">
                                <svg width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path d="M5 12l5 5l10 -10"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="focus:text-indigo-600">
                    <div class="flex items-center pl-5">
                        <p class="text-base font-medium leading-none text-gray-700 mr-2">${group.name}</p>
                    </div>
                </td>
                <td class="pl-24">
                    <div class="flex items-center">
                        <p class="text-sm leading-none text-blue-600 ml-2">${group.students?.length || 0}</p>
                    </div>
                </td>
                <td class="pl-5">
                    <p class="text-sm leading-none text-gray-600 ml-2">${group.formattedDate}</p>
                </td>
                <td class="pl-5">
                    <button class="focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 text-sm leading-none text-white py-3 px-5 bg-blue-500 rounded hover:bg-blue-600 focus:outline-none showListBtn">
                        Ro‘yxatni ko‘rish
                    </button>
                </td>
            `;
            tbody.appendChild(row); // 🛠 **Har bir guruh jadvalga qo‘shiladi**
        });

    } catch (error) {
        console.error("❌ Xatolik:", error);
        document.querySelector("tbody").innerHTML = "<tr><td colspan='7'>❌ Guruhlar yuklanmadi!</td></tr>";
    }
}



async function loadGroups() {
    try {
        console.log("🚀 Guruhlar ro‘yxatini yuklash...");
        const response = await fetch("http://127.0.0.1:7777/api/groups");

        if (!response.ok) {
            throw new Error("❌ Guruhlarni olishda xatolik yuz berdi!");
        }

        const groups = await response.json();
        console.log("✅ Olingan guruhlar:", groups);

        const tbody = document.querySelector("tbody"); // 🛠 **Jadvalni topamiz**

        if (!groups.length) {
            tbody.innerHTML = "<tr><td colspan='7' class='text-center'>❌ Hech qanday guruh topilmadi!</td></tr>";
            return;
        }

        groups.forEach(group => {
            if (!document.querySelector(`#group-${group.name}`)) { // ✅ **Agar guruh jadvalda bo‘lmasa, qo‘shamiz**
                const row = document.createElement("tr");
                row.id = `group-${group.name}`;
                row.className = "h-16 border border-gray-100 rounded";
                row.innerHTML = `
                   
                `;
                tbody.appendChild(row); // 🛠 **Yangi guruh jadvalga qo‘shiladi**
            }
        });

    } catch (error) {
        console.error("❌ Xatolik:", error);
        document.querySelector("tbody").innerHTML = "<tr><td colspan='7'>❌ Guruhlar yuklanmadi!</td></tr>";
    }
}
