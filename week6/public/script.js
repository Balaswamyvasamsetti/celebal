const BASE_URL = 'http://localhost:3002';

let currentTab = 'users';
let editingId = null;

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupForms();
});

// Tab switching
function showTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[onclick="showTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab).classList.add('active');
    
    currentTab = tab;
    editingId = null;
    
    if (tab === 'users') loadUsers();
    else if (tab === 'products') loadProducts();
    else if (tab === 'orders') loadOrders();
}

// Setup form handlers
function setupForms() {
    // Users form
    document.getElementById('userForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            age: parseInt(document.getElementById('userAge').value)
        };
        
        if (editingId) {
            await updateItem('users', editingId, data);
        } else {
            await createItem('users', data);
        }
        
        document.getElementById('userForm').reset();
        resetForm('user');
        loadUsers();
    });
    
    // Products form
    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            category: document.getElementById('productCategory').value,
            stock: parseInt(document.getElementById('productStock').value)
        };
        
        if (editingId) {
            await updateItem('products', editingId, data);
        } else {
            await createItem('products', data);
        }
        
        document.getElementById('productForm').reset();
        resetForm('product');
        loadProducts();
    });
    
    // Orders form
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            userId: document.getElementById('orderUserId').value,
            items: document.getElementById('orderItems').value.split(','),
            total: parseFloat(document.getElementById('orderTotal').value),
            status: document.getElementById('orderStatus').value
        };
        
        if (editingId) {
            await updateItem('orders', editingId, data);
        } else {
            await createItem('orders', data);
        }
        
        document.getElementById('orderForm').reset();
        resetForm('order');
        loadOrders();
    });
    
    // Cancel buttons
    document.getElementById('userCancelBtn').addEventListener('click', () => {
        document.getElementById('userForm').reset();
        resetForm('user');
    });
    
    document.getElementById('productCancelBtn').addEventListener('click', () => {
        document.getElementById('productForm').reset();
        resetForm('product');
    });
    
    document.getElementById('orderCancelBtn').addEventListener('click', () => {
        document.getElementById('orderForm').reset();
        resetForm('order');
    });
}

// Generic CRUD functions
async function createItem(resource, data) {
    try {
        await fetch(`${BASE_URL}/${resource}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error(`Error creating ${resource}:`, error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${BASE_URL}/users`);
        const users = await response.json();
        document.getElementById('usersList').innerHTML = users.map(user => `
            <div class="item-card">
                <div class="item-info">
                    <strong>${user.name}</strong> - ${user.email} (Age: ${user.age})
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editUser('${user._id}', '${user.name}', '${user.email}', ${user.age})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem('users', '${user._id}', loadUsers)">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${BASE_URL}/products`);
        const products = await response.json();
        document.getElementById('productsList').innerHTML = products.map(product => `
            <div class="item-card">
                <div class="item-info">
                    <strong>${product.name}</strong> - $${product.price} (${product.category}) Stock: ${product.stock}
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editProduct('${product._id}', '${product.name}', ${product.price}, '${product.category}', ${product.stock})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem('products', '${product._id}', loadProducts)">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadOrders() {
    try {
        const response = await fetch(`${BASE_URL}/orders`);
        const orders = await response.json();
        document.getElementById('ordersList').innerHTML = orders.map(order => `
            <div class="item-card">
                <div class="item-info">
                    <strong>Order ${order._id.slice(-6)}</strong> - User: ${order.userId} | Total: $${order.total} | Status: ${order.status}
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editOrder('${order._id}', '${order.userId}', '${order.items.join(',')}', ${order.total}, '${order.status}')">Edit</button>
                    <button class="delete-btn" onclick="deleteItem('orders', '${order._id}', loadOrders)">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Edit functions
function editUser(id, name, email, age) {
    editingId = id;
    document.getElementById('userName').value = name;
    document.getElementById('userEmail').value = email;
    document.getElementById('userAge').value = age;
    document.getElementById('userSubmitBtn').textContent = 'Update User';
    document.getElementById('userCancelBtn').style.display = 'inline-block';
}

function editProduct(id, name, price, category, stock) {
    editingId = id;
    document.getElementById('productName').value = name;
    document.getElementById('productPrice').value = price;
    document.getElementById('productCategory').value = category;
    document.getElementById('productStock').value = stock;
    document.getElementById('productSubmitBtn').textContent = 'Update Product';
    document.getElementById('productCancelBtn').style.display = 'inline-block';
}

function editOrder(id, userId, items, total, status) {
    editingId = id;
    document.getElementById('orderUserId').value = userId;
    document.getElementById('orderItems').value = items;
    document.getElementById('orderTotal').value = total;
    document.getElementById('orderStatus').value = status;
    document.getElementById('orderSubmitBtn').textContent = 'Update Order';
    document.getElementById('orderCancelBtn').style.display = 'inline-block';
}

// Update function
async function updateItem(resource, id, data) {
    try {
        await fetch(`${BASE_URL}/${resource}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error(`Error updating ${resource}:`, error);
    }
}

// Delete function
async function deleteItem(resource, id, reloadFunction) {
    if (confirm(`Are you sure you want to delete this ${resource.slice(0, -1)}?`)) {
        try {
            await fetch(`${BASE_URL}/${resource}/${id}`, { method: 'DELETE' });
            reloadFunction();
        } catch (error) {
            console.error(`Error deleting ${resource}:`, error);
        }
    }
}

// Reset form
function resetForm(type) {
    editingId = null;
    document.getElementById(`${type}SubmitBtn`).textContent = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    document.getElementById(`${type}CancelBtn`).style.display = 'none';
}