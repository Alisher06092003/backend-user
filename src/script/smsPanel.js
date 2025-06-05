
        



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

    dropdownButton.addEventListener("click", handleGroupCreation);

    async function handleGroupCreation() {
        const groupName = groupNameInput.value.trim();

        if (!validateInput(groupName)) return;

        try {
            const response = await createGroup(groupName);
            await handleResponse(response);
            groupNameInput.value = ""; // 🛠 **Inputni tozalash**
            loadGroups(); // 🔄 **Ro‘yxatni darhol yangilash**
        } catch (error) {
            console.error("❌ Xatolik:", error);
            alert("❌ Guruh yaratishda muammo yuz berdi!");
        }
    }

    function validateInput(groupName) {
        if (!groupName) {
            alert("❌ Guruh nomini kiritishingiz kerak!");
            return false;
        }
        return true;
    }

    async function createGroup(groupName) {
        console.log("🚀 Guruh yaratish so‘rovi yuborildi:", groupName);
        const response = await fetch("http://127.0.0.1:7777/api/create-group", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: groupName })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Server xatosi!");
        }
        return response;
    }

    async function handleResponse(response) {
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

        alert(`✅ Guruh yaratildi: ${data.message}`);
    }
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

        const tbody = document.querySelector("tbody");
        tbody.innerHTML = ""; // Avvalgi ro'yxatni tozalash

        if (!groups.length) {
            tbody.innerHTML = "<tr><td colspan='7' class='text-center'>❌ Hech qanday guruh topilmadi!</td></tr>";
            return;
        }

        groups.forEach(group => {
            const createdAt = new Date(group.createdAt);
            const year = createdAt.getFullYear();
            const month = createdAt.toLocaleString('uz-UZ', { month: 'long' });
            const day = createdAt.getDate();
            const time = createdAt.toLocaleTimeString('uz-UZ', { hour12: false });

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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                        </svg>
                        <p class="text-sm leading-none text-blue-600 ml-2">${group.students?.length || 0}</p>
                    </div>
                </td>
                <td class="pl-5">
                    <div class="flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-blue-500">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                        </svg>
                        <p class="text-sm leading-none text-gray-600 ml-2">${group.formattedDate}</p>
                    </div>
                </td>
                <td class="pl-5">
                    <div class="flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-yellow-500">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                        <p class="text-sm leading-none text-gray-600 ml-2">${time}</p>
                    </div>
                </td>
                <td class="pl-5">
                    <button class="focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 text-sm leading-none text-white py-3 px-5 bg-blue-500 rounded hover:bg-blue-600 focus:outline-none showListBtn">
                        Ro‘yxatni ko‘rish
                    </button>
                </td>
                <td class="pl-5">
                     <div class="flex items-center">
                        <section class=" flex items-center px-10 bg-gray-800 rounded gap-2" onclick="document.getElementById('myModal').showModal()">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>

                            <p class="py-2  text-white  text shadow-xl" id="btn">
                            contact
                            </p>

                         </section>
                     </div>
                <td class="px-5 pl-5">
                
                                              <div class="flex gap-3  w-16">
                                                
                                                <a  href="#" class="bg-red-200 p-2 rounded">
                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-500">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                  </svg>
                                                </a>
                                           </div>
                                     </td>
            `;
            tbody.appendChild(row); // Har bir guruh jadvalga qo'shiladi
        });

        // Modalni ochish
        document.querySelectorAll('.showListBtn').forEach(button => {
            button.addEventListener('click', () => {
                document.getElementById('userModal').classList.remove('hidden'); // Modalni ochish
            });
        });

    } catch (error) {
        console.error("❌ Xatolik:", error);
        document.querySelector("tbody").innerHTML = "<tr><td colspan='7'>❌ Guruhlar yuklanmadi!</td></tr>";
    }
}

// Sahna yuklanganda guruhlarni yuklash
document.addEventListener('DOMContentLoaded', loadGroups);

// Modalni ochish
    document.querySelectorAll('.showListBtn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('userModal').classList.remove('hidden');
        });
    });

    // Modalni yopish
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('userModal').classList.add('hidden');
    });

    // Modalni yopish uchun fonni bosish
    document.getElementById('userModal').addEventListener('click', (event) => {
        if (event.target === event.currentTarget) {
            document.getElementById('userModal').classList.add('hidden');
        }
    });




