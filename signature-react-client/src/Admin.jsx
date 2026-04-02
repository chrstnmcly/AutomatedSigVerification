import React, { useState, useEffect } from 'react';
import { Trash2, Save, UserPlus, X } from 'lucide-react';
import { useAppContext } from './context/AppContext';
import { RBAC_DATA } from './constants/rbac_constants';
import { userService } from './api/userService'; 
import { authService } from './api/authService';
import ToggleSwitch from './components/common/ToggleSwitch';

const Admin = () => {
    const { showToast, showLoader } = useAppContext();
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', roleName: 'Bank Teller' });

    const fetchUsers = async () => {
        showLoader(true);
        try {
            const data = await userService.getAllUsers();
            const enrichedUsers = data.map(u => ({
                ...u,
                permissions: RBAC_DATA.roles.find(r => r.role === u.roleName)?.permissions || []
            }));
            setUsers(enrichedUsers);
        } catch (err) {
            showToast(err, "error");
        } finally {
            showLoader(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (username, currentStatus) => {
        // Optimistic UI update
        const updatedUsers = users.map(u =>
            u.username === username ? { ...u, isActive: !currentStatus } : u
        );
        setUsers(updatedUsers);

        try {
            await userService.updateUserStatus(username, !currentStatus);
            showToast(`${username} status updated`, "success");
        } catch (err) {
            // Rollback on failure
            setUsers(users.map(u =>
                u.username === username ? { ...u, isActive: currentStatus } : u
            ));
            showToast(err.toString(), "error");
        }
    };

    const handleRoleChange = (username, newRoleName) => {
        const roleInfo = RBAC_DATA.roles.find(r => r.role === newRoleName);

        setUsers(users.map(u =>
            u.username === username
                ? { ...u, roleName: newRoleName, permissions: roleInfo.permissions }
                : u
        ));
        showToast(`Role Selected. Click save to persist.`, "info");
    };

    const handleDelete = async (username) => {
        if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
            showLoader(true);
            try {
                await userService.deleteUser(username);
                setUsers(users.filter(u => u.username !== username));
                showToast(`User ${username} deleted successfully`, "success");
            } catch (err) {
                showToast(err, "error");
            } finally {
                showLoader(false);
            }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUser.username) return showToast("Username is required", "error");

        showLoader(true);
        try {
            await authService.register(newUser);
            showToast(`User ${newUser.username} created with default password`, "success");
            setIsModalOpen(false);
            setNewUser({ username: '', roleName: 'Bank Teller' });
            fetchUsers(); // Refresh list
        } catch (err) {
            const message = err?.message || err?.toString() || "An unknown error occurred";
            showToast(message, "error");
        } finally {
            showLoader(false);
        }
    };

    const handleSave = async (username, newRole) => {
        showLoader(true);
        try {
            await userService.updateUserRole(username, newRole);

            showToast(`Role for ${username} saved successfully!`, "success");

            fetchUsers();
        } catch (err) {
            const msg = err?.message || err?.toString() || "Save failed";
            showToast(msg, "error");
        } finally {
            showLoader(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white">Admin Command Center</h1>
                    <p className="text-slate-400">Manage system users and access levels</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all font-bold shadow-lg"
                >
                    <UserPlus size={18} /> Add User
                </button>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white">Register New User</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                                    placeholder="e.g. jsmith_teller"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assign Role</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                                    value={newUser.roleName}
                                    onChange={(e) => setNewUser({ ...newUser, roleName: e.target.value })}
                                >
                                    {RBAC_DATA.roles.map(r => <option key={r.role} value={r.role}>{r.role}</option>)}
                                </select>
                            </div>
                            <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
                                <p className="text-[10px] text-indigo-400 font-medium italic">
                                    Note: New users are assigned "P@ssword123" by default.
                                </p>
                            </div>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl mt-4 transition-all">
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">User Details</th>
                            <th className="p-4">System Role</th>
                            <th className="p-4 text-center">Status</th> {/* New Header */}
                            <th className="p-4">Effective Permissions</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">No users found in database.</td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.username} className="hover:bg-slate-800/30 transition-colors">
                                    {/* 1. User Details */}
                                    <td className="p-4">
                                        <div className="font-bold text-white">{user.username}</div>
                                        <div className="text-[10px] text-slate-500 font-mono uppercase">
                                            Created: {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>

                                    {/* 2. System Role */}
                                    <td className="p-4">
                                        <select
                                            value={user.roleName}
                                            onChange={(e) => handleRoleChange(user.username, e.target.value)}
                                            className="bg-slate-950 border border-slate-700 text-sm text-indigo-400 rounded-lg p-2 focus:ring-1 ring-indigo-500 outline-none w-full cursor-pointer"
                                        >
                                            {RBAC_DATA.roles.map(r => <option key={r.role} value={r.role}>{r.role}</option>)}
                                        </select>
                                    </td>

                                    {/* 3. Account Status Toggle */}
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            <ToggleSwitch
                                                isOn={user.isActive}
                                                onToggle={() => handleToggleStatus(user.username, user.isActive)}
                                            />
                                        </div>
                                    </td>

                                    {/* 4. Effective Permissions */}
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {user.permissions.map(p => (
                                                <span key={p} className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md whitespace-nowrap">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    {/* 5. Actions */}
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleSave(user.username, user.roleName)}
                                                className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                                                title="Save Changes"
                                            >
                                                <Save size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.username)}
                                                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
