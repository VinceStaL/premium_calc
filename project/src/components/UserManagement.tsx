import React, { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ArrowLeft, UserCog, RefreshCw, Shield, ShieldAlert, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  onBack: () => void;
}

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export function UserManagement({ onBack }: Props) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      checkAdminStatus();
      fetchUsers();
    }
  }, [session?.user?.email]);

  async function checkAdminStatus() {
    if (!session?.user?.email) return;

    try {
      // First check if user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        return;
      }

      // If no profile exists, create one with default user role
      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              role: session.user.email === 'gdavidsons53@gmail.com' ? 'admin' : 'user'
            }
          ]);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          return;
        }

        // Set admin status for setup admin
        if (session.user.email === 'gdavidsons53@gmail.com') {
          setIsAdmin(true);
          return;
        }
      } else {
        // Set admin status if user is either the setup admin or has admin role
        setIsAdmin(session.user.email === 'gdavidsons53@gmail.com' || profile.role === 'admin');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast.error('Error checking admin status');
    }
  }

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    if (!isAdmin) {
      toast.error('Only administrators can change user roles');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  }

  async function handlePasswordReset(email: string) {
    if (!isAdmin) {
      toast.error('Only administrators can reset passwords');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });

      if (error) throw error;
      toast.success('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast.error('Failed to send password reset email');
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!isAdmin) {
      toast.error('Only administrators can delete users');
      return;
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // First delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Then delete from auth.users
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this page.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <UserCog className="w-8 h-8 text-gray-600" />
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Sign In
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAdmin ? (
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-sm text-gray-900 border rounded-md px-2 py-1"
                          disabled={user.email === 'gdavidsons53@gmail.com'}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="text-sm text-gray-900">{user.role}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handlePasswordReset(user.email)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Reset Password"
                          >
                            <RefreshCw className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                            className={`${
                              user.role === 'admin' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                            title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            disabled={user.email === 'gdavidsons53@gmail.com'}
                          >
                            {user.role === 'admin' ? (
                              <ShieldAlert className="w-5 h-5" />
                            ) : (
                              <Shield className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                            disabled={user.email === 'gdavidsons53@gmail.com'}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}