//Registration section tabls
function datatables() {
    return {
        headings: [
            {
                'key': 'userId',
                'value': 'User ID'
            },
            {
                'key': 'firstName',
                'value': 'Firstname'
            },
            {
                'key': 'lastName',
                'value': 'Lastname'
            },
            {
                'key': 'phone1',
                'value': 'Phone 1'
            },
            {
                'key': 'phone2',
                'value': 'Phone 2'
            },
            {
                'key': 'group',
                'value': 'Group'
            },
            {
                'key': 'delet',
                'value': 'Change/Delet'
            }
        ],
        users: [{
            "userId": "",
            "firstName": "Alisher",
            "lastName": "Qurbonov",
            "phone1": "+998 91 147 64 07",
            "phone2": "+998 77 099 15 04",
            "group": "Tarix",
            "delet": ""
        }, 
    
    ],
        selectedRows: [],

        open: false,
        
        toggleColumn(key) {
            // Note: All td must have the same class name as the headings key! 
            let columns = document.querySelectorAll('.' + key);

            if (this.$refs[key].classList.contains('hidden') && this.$refs[key].classList.contains(key)) {
                columns.forEach(column => {
                    column.classList.remove('hidden');
                });
            } else {
                columns.forEach(column => {
                    column.classList.add('hidden');
                });
            }
        },

        getRowDetail($event, id) {
            let rows = this.selectedRows;

            if (rows.includes(id)) {
                let index = rows.indexOf(id);
                rows.splice(index, 1);
            } else {
                rows.push(id);
            }
        },

        selectAllCheckbox($event) {
            let columns = document.querySelectorAll('.rowCheckbox');

            this.selectedRows = [];

            if ($event.target.checked == true) {
                columns.forEach(column => {
                    column.checked = true
                    this.selectedRows.push(parseInt(column.name))
                });
            } else {
                columns.forEach(column => {
                    column.checked = false
                });
                this.selectedRows = [];
            }
        }
    }
}


// this throws an error
document.getElementById("registeredBtn").addEventListener("click", () => {
    document.querySelector(".antialiased.sans-serif.h-screen").classList.add("hidden"); // ❌ Yashirish
    document.getElementById("errors").classList.remove("hidden"); // ✅ Ko‘rsatish
});

document.getElementById("addStudentsBtn").addEventListener("click", () => {
    document.querySelector(".antialiased.sans-serif.h-screen").classList.remove("hidden"); // ✅ Ko‘rsatish
    document.getElementById("errors").classList.add("hidden"); // ❌ Yashirish
});

document.getElementById("addAdminBtn").addEventListener("click", () => {
    document.querySelector(".antialiased.sans-serif.h-screen").classList.add("hidden"); // ❌ Yashirish
    document.getElementById("errors").classList.remove("hidden"); // ✅ Ko‘rsatish
});

// Additional window Click cinopka 
document.getElementById("addStudentsBtn").addEventListener("click", () => {
    const switchElement = document.querySelector(".elSwitch");
    const iconElement = document.querySelector(".elSwitch svg");
    const textElement = document.querySelector("#addstuden");

    switchElement.style.transform = "translateX(0%)"; // ✅ Chapga siljish
    iconElement.style.transform = "rotate(720deg)";
    textElement.textContent = "Add Students";
});

document.getElementById("registeredBtn").addEventListener("click", () => {
    const switchElement = document.querySelector(".elSwitch");
    const iconElement = document.querySelector(".elSwitch svg");
    const textElement = document.querySelector("#addstuden");

    switchElement.style.transform = "translateX(100%)"; // ✅ O‘rtaga siljish
    iconElement.style.transform = "rotate(360deg)";
    textElement.textContent = "Registered Users";
});

document.getElementById("addAdminBtn").addEventListener("click", () => {
    const switchElement = document.querySelector(".elSwitch");
    const iconElement = document.querySelector(".elSwitch svg");
    const textElement = document.querySelector("#addstuden");

    switchElement.style.transform = "translateX(200%)"; // ✅ O‘ngga siljish
    iconElement.style.transform = "rotate(180deg)";
    textElement.textContent = "Add Admin";
});

async function editUser(userId) {
    try {
        const response = await fetch(`http://localhost:7777/api/students/${userId}`);
        const data = await response.json();

        // Formani to'ldirish
        document.getElementById('grid-first-name').value = data.firstName;
        document.getElementById('grid-last-name').value = data.lastName;
        document.getElementById('phone1').value = data.phone1;
        document.getElementById('phone2').value = data.phone2;

        // Saqlash tugmasini yangilash
        document.getElementById('saveButton').onclick = function() {
            updateUser(userId);
        };
    } catch (error) {
        console.error("Xatolik:", error);
    }
}


async function deleteUser(userId) {
    if (!userId) {
        alert("Foydalanuvchi ID mavjud emas!");
        return;
    }

    const confirmDelete = confirm("Rostdan ham ushbu foydalanuvchini o‘chirishni istaysizmi?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:7777/api/students/${userId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Foydalanuvchi muvaffaqiyatli o‘chirildi!");
            location.reload(); // Sahifani yangilash
        } else {
            alert("Xatolik yuz berdi.");
        }
    } catch (error) {
        console.error("O‘chirishda xatolik:", error);
    }
}











// Talabani tahrirlash
async function editUser(userId) {
    try {
        const response = await fetch(`http://localhost:7777/api/students/${userId}`);
        const data = await response.json();

        // Formani to'ldirish
        document.getElementById('grid-first-name').value = data.firstName;
        document.getElementById('grid-last-name').value = data.lastName;
        document.getElementById('phone1').value = data.phone1;
        document.getElementById('phone2').value = data.phone2;

        // Saqlash tugmasini yangilash
        document.getElementById('saveButton').onclick = function() {
            updateUser(userId);
        };
    } catch (error) {
        console.error("Xatolik:", error);
    }
}

// Talabani yangilash
async function updateUser(userId) {
    const updatedData = {
        firstName: document.getElementById('grid-first-name').value.trim(),
        lastName: document.getElementById('grid-last-name').value.trim(),
        phone1: document.getElementById('phone1').value,
        phone2: document.getElementById('phone2').value
    };

    try {
        const response = await fetch(`http://localhost:7777/api/students/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("Talaba muvaffaqiyatli yangilandi!");
            location.reload(); // Yangilash
        } else {
            alert("Yangilashda xato yuz berdi.");
        }
    } catch (error) {
        console.error("Xatolik:", error);
    }
}

// Talabani o'chirish
async function deleteUser(userId) {
    if (confirm("Talabani o'chirmoqchimisiz?")) {
        try {
            const response = await fetch(`http://localhost:7777/api/students/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Talaba muvaffaqiyatli o'chirildi!");
                location.reload(); // Ro'yxatni yangilash
            } else {
                alert("O'chirishda xato yuz berdi.");
            }
        } catch (error) {
            console.error("Xatolik:", error);
            alert("Ulanish xatosi!");
        }
    }
}





