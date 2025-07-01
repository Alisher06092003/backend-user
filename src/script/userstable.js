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




// Tanlanga foydalanuvchilar o'chrish

function selectAllCheckbox(event) {
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = event.target.checked;
    });

    window.selectedUserIds = event.target.checked
        ? Array.from(checkboxes).map(checkbox => checkbox.name)
        : [];
}


function deleteSelectedUsers() {
    const checkboxes = document.querySelectorAll('.rowCheckbox:checked');
    const selectedUserIds = Array.from(checkboxes).map(checkbox => checkbox.name);

    if (selectedUserIds.length === 0) {
        showError("Siz Foydalanuvchini tanlamadingiz");
        return;
    }

    // ✅ Swal tasdiqlash oynasini chaqirish
    showConfirmDialog("Tanlangan foydalanuvchilarni o‘chirishni istaysizmi?", () => {
        selectedUserIds.forEach(async (userId) => {
            try {
                const response = await fetch(`http://localhost:7777/api/students/${userId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    console.log(`✅ O‘chirildi: ${userId}`);
                } else {
                    console.error(`❌ Xatolik: ${userId} ni o‘chirishda muammo`);
                }
            } catch (error) {
                console.error(`❌ Serverda xatolik: ${userId}`, error);
            }
        });

        showSuccess("Tanlangan foydalanuvchilar muvaffaqiyatli o‘chirildi!");
        setTimeout(() => location.reload(), 3000);
    });
}


function showConfirmDialog(text, confirmCallback) {
    Swal.fire({
        text: text,
        icon: "warning",
        iconColor: "red",
        color: "red",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Bekor qilish",
        confirmButtonColor: "red",
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            confirmCallback(); // Agar OK bosilsa, davom ettiradi
        }
    });
}

function deleteUser(userId) {
    showConfirmDialog("Ushbu foydalanuvchini o‘chirishni istaysizmi?", async () => {
        try {
            const response = await fetch(`http://localhost:7777/api/students/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                showSuccess("Foydalanuvchi muvaffaqiyatli o‘chirildi!");
                setTimeout(() => location.reload(), 3000);
            } else {
                showError("Foydalanuvchini o‘chirishda muammo yuz berdi.");
            }
        } catch (error) {
            showError("Serverda xatolik yuz berdi.");
        }
    });
}



function showSuccess(message) {
    Swal.fire({
        text: message,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
    });
}

function showError(message) {
    Swal.fire({
        title: "",
        text: message,
        icon: "error",
    });
}



function editUser(userId) {
    if (!userId || userId.length !== 24) {
        showError("❌ Noto‘g‘ri foydalanuvchi ID!");
        return;
    }

    fetch(`http://localhost:7777/api/students/${encodeURI(userId)}`)
        .then(response => response.json())
        .then(user => {
            console.log("Yuklangan foydalanuvchi:", user); // 🛠 Konsolda tekshirish!

            const modal = document.getElementById("editUserModal");
            modal.classList.remove("hidden"); // ✅ Modalni ochish!

            document.getElementById("editFirstName").value = user.firstName ?? "";
            document.getElementById("editLastName").value = user.lastName ?? "";
            document.getElementById("editPhone1").value = user.phone1 ?? "";
            document.getElementById("editPhone2").value = user.phone2 ?? "";
            document.getElementById("editGroup").value = user.group ?? "";

            document.getElementById("saveEditBtn").setAttribute("data-user-id", userId);
        })
        .catch(() => showError("❌ Foydalanuvchini yuklashda muammo"));
}


function saveUserChanges() {
    const userId = document.getElementById("saveEditBtn").getAttribute("data-user-id");

    if (!userId || userId.length !== 24) {
        showError("❌ Noto‘g‘ri foydalanuvchi ID!");
        return;
    }

    const updatedUser = {
        firstName: document.getElementById("editFirstName").value,
        lastName: document.getElementById("editLastName").value,
        phone1: document.getElementById("editPhone1").value,
        phone2: document.getElementById("editPhone2").value,
        group: document.getElementById("editGroup").value,
    };

    fetch(`http://localhost:7777/api/students/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser),
})
.then(response => response.json()) // ✅ Javobni tekshirish
.then(data => {
    console.log("Server javobi:", data); // 🛠 Konsolda tekshirish!
    showSuccess("✅ Foydalanuvchi muvaffaqiyatli yangilandi!");
    setTimeout(() => location.reload(), 3000);
})
.catch(error => {
    console.error("Xatolik:", error);
    showError("Tahrirlashda muammo yuz berdi!");
});

}

console.log("Saqlash tugmasi ID:", document.getElementById("saveEditBtn").getAttribute("data-user-id"));







