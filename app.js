// App.js
import React, { useState } from "react";

// Mock Data
const initialUsers = [
  { id: 1, name: "Alice", email: "alice@example.com", roles: ["Admin"], status: "Active" },
  { id: 2, name: "Bob", email: "bob@example.com", roles: ["Viewer"], status: "Inactive" },
];
const initialRoles = [
  { id: 1, name: "Admin", permissions: ["Read", "Write", "Delete"] },
  { id: 2, name: "Viewer", permissions: ["Read"] },
];

// Main App
function App() {
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [currentTab, setCurrentTab] = useState("users"); // 'users' or 'roles'

  // Add or Update User
  const handleSaveUser = (user) => {
    setUsers((prev) =>
      user.id
        ? prev.map((u) => (u.id === user.id ? user : u))
        : [...prev, { ...user, id: Date.now() }]
    );
  };

  // Delete User
  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Add or Update Role
  const handleSaveRole = (role) => {
    setRoles((prev) =>
      role.id
        ? prev.map((r) => (r.id === role.id ? role : r))
        : [...prev, { ...role, id: Date.now() }]
    );
  };

  // Delete Role
  const handleDeleteRole = (id) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <header>
        <button onClick={() => setCurrentTab("users")}>Users</button>
        <button onClick={() => setCurrentTab("roles")}>Roles</button>
      </header>

      <main>
        {currentTab === "users" ? (
          <UserManagement
            users={users}
            roles={roles}
            onSave={handleSaveUser}
            onDelete={handleDeleteUser}
          />
        ) : (
          <RoleManagement roles={roles} onSave={handleSaveRole} onDelete={handleDeleteRole} />
        )}
      </main>
    </div>
  );
}

// User Management Component
function UserManagement({ users, roles, onSave, onDelete }) {
  const [editingUser, setEditingUser] = useState(null);

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={() => setEditingUser({})}>Add User</button>
      {editingUser && (
        <UserForm
          user={editingUser}
          roles={roles}
          onSave={(user) => {
            onSave(user);
            setEditingUser(null);
          }}
          onCancel={() => setEditingUser(null)}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(", ")}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => setEditingUser(user)}>Edit</button>
                <button onClick={() => onDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// User Form
function UserForm({ user, roles, onSave, onCancel }) {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
    >
      <label>
        Name:
        <input name="name" value={formData.name || ""} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input name="email" value={formData.email || ""} onChange={handleChange} />
      </label>
      <label>
        Roles:
        <select
          name="roles"
          multiple
          value={formData.roles || []}
          onChange={(e) =>
            setFormData({
              ...formData,
              roles: Array.from(e.target.selectedOptions, (option) => option.value),
            })
          }
        >
          {roles.map((role) => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Status:
        <select name="status" value={formData.status || "Active"} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

// Role Management Component
function RoleManagement({ roles, onSave, onDelete }) {
  const [editingRole, setEditingRole] = useState(null);

  return (
    <div>
      <h1>Role Management</h1>
      <button onClick={() => setEditingRole({})}>Add Role</button>
      {editingRole && (
        <RoleForm
          role={editingRole}
          onSave={(role) => {
            onSave(role);
            setEditingRole(null);
          }}
          onCancel={() => setEditingRole(null)}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.permissions.join(", ")}</td>
              <td>
                <button onClick={() => setEditingRole(role)}>Edit</button>
                <button onClick={() => onDelete(role.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Role Form
function RoleForm({ role, onSave, onCancel }) {
  const [formData, setFormData] = useState(role);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
    >
      <label>
        Role Name:
        <input name="name" value={formData.name || ""} onChange={handleChange} />
      </label>
      <label>
        Permissions (comma-separated):
        <input
          name="permissions"
          value={formData.permissions?.join(", ") || ""}
          onChange={(e) =>
            setFormData({ ...formData, permissions: e.target.value.split(",").map((p) => p.trim()) })
          }
        />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default App;
