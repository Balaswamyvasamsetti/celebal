const API_URL = 'http://localhost:3000/users';

const form = document.getElementById('userForm');
const usersList = document.getElementById('usersList');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

let editingUserId = null;

// Load users on page load
document.addEventListener('DOMContentLoaded', loadUsers);

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value)
    };

    if (editingUserId) {
        await updateUser(editingUserId, userData);
    } else {
        await createUser(userData);
    }
    
    form.reset();
    resetForm();
    loadUsers();
});

// Cancel editing
cancelBtn.addEventListener('click', () => {
    form.reset();
    resetForm();
});

// Create user
async function createUser(userData) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

// Load all users
async function loadUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Display users
function displayUsers(users) {
    usersList.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="user-info">
                <strong>${user.name}</strong> - ${user.email} (Age: ${user.age})
            </div>
            <div class="user-actions">
                <button class="edit-btn" onclick="editUser('${user._id}', '${user.name}', '${user.email}', ${user.age})">Edit</button>
                <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Edit user
function editUser(id, name, email, age) {
    editingUserId = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('age').value = age;
    submitBtn.textContent = 'Update User';
    cancelBtn.style.display = 'inline-block';
}

// Update user
async function updateUser(id, userData) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

// Delete user
async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}

// Reset form to add mode
function resetForm() {
    editingUserId = null;
    submitBtn.textContent = 'Add User';
    cancelBtn.style.display = 'none';
}