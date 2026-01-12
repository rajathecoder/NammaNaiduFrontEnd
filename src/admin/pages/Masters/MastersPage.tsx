import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import {
  getMastersByType,
  createMaster,
  updateMaster,
  deleteMaster,
  type MasterItem,
  type MasterType,
} from '../../../services/api/master.api';

const masterTypes: Record<MasterType, { title: string; fields: string[] }> = {
  religion: { title: 'Religion Master', fields: ['name'] },
  caste: { title: 'Caste Master', fields: ['name', 'code'] },
  occupation: { title: 'Occupation Master', fields: ['name'] },
  location: { title: 'Location Master', fields: ['name', 'code'] },
  education: { title: 'Education Master', fields: ['name'] },
  'employment-type': { title: 'Employment Type Master', fields: ['name'] },
  'income-currency': { title: 'Income Currency Master', fields: ['name', 'code'] },
  'income-range': { title: 'Income Range Master', fields: ['name'] },
};

const DEFAULT_MASTER_TYPE: MasterType = 'religion';

const isMasterType = (value?: string): value is MasterType => {
  return !!value && Object.prototype.hasOwnProperty.call(masterTypes, value);
};

const MastersPage: React.FC = () => {
  const { type } = useParams<{ type?: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null);
  const [formData, setFormData] = useState<{ name: string; code: string; status: 'active' | 'inactive' }>({ name: '', code: '', status: 'active' });

  const masterType: MasterType = isMasterType(type) ? type : DEFAULT_MASTER_TYPE;
  const config = masterTypes[masterType];

  // Redirect to default type if no type or invalid type
  useEffect(() => {
    if (!type || !isMasterType(type)) {
      navigate(`/admin/masters/${DEFAULT_MASTER_TYPE}`, { replace: true });
    }
  }, [type, navigate]);

  // Fetch masters from API when type changes
  useEffect(() => {
    if (!isMasterType(type)) {
      return;
    }

    // Reset form state when type changes
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ name: '', code: '', status: 'active' });

    const fetchMasters = async () => {
      setLoading(true);
      try {
        const adminToken = localStorage.getItem('adminToken');
        const response = await getMastersByType(masterType, undefined, adminToken || undefined);

        if (response.success && response.data) {
          // Ensure createdAt is always a string
          const formattedData = response.data.map(item => ({
            ...item,
            createdAt: item.createdAt || new Date().toISOString().split('T')[0],
          }));
          setItems(formattedData);
        } else {
          console.error('Failed to fetch masters:', response.message);
          setItems([]);
          // If it's an invalid master type error, redirect to default
          if (response.message && response.message.includes('Invalid master type')) {
            navigate(`/admin/masters/${DEFAULT_MASTER_TYPE}`, { replace: true });
          }
        }
      } catch (error: any) {
        console.error('Error fetching masters:', error);
        setItems([]);
        // If it's an invalid master type error, redirect to default
        if (error.message && error.message.includes('Invalid master type')) {
          navigate(`/admin/masters/${DEFAULT_MASTER_TYPE}`, { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMasters();
  }, [type, masterType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMasterType(type)) return;

    const adminToken = localStorage.getItem('adminToken');
    
    try {
      if (editingItem) {
        // Update existing master
        const response = await updateMaster(
          masterType,
          editingItem.id,
          formData,
          adminToken || undefined
        );
        
        if (response.success && response.data) {
          const updatedItem = {
            ...response.data,
            createdAt: response.data.createdAt || new Date().toISOString().split('T')[0],
          };
          setItems(prev => prev.map(item => 
            item.id === editingItem.id ? updatedItem : item
          ));
          setShowAddForm(false);
          setEditingItem(null);
          setFormData({ name: '', code: '', status: 'active' });
        } else {
          alert(response.message || 'Failed to update master');
        }
      } else {
        // Create new master
        const response = await createMaster(
          masterType,
          formData,
          adminToken || undefined
        );
        
        if (response.success && response.data) {
          const newItem = {
            ...response.data,
            createdAt: response.data.createdAt || new Date().toISOString().split('T')[0],
          };
          setItems(prev => [...prev, newItem]);
          setShowAddForm(false);
          setFormData({ name: '', code: '', status: 'active' });
        } else {
          alert(response.message || 'Failed to create master');
        }
      }
    } catch (error) {
      console.error('Error saving master:', error);
      alert('Failed to save master. Please try again.');
    }
  };

  const handleEdit = (item: MasterItem) => {
    setEditingItem(item);
    setFormData({ 
      name: item.name, 
      code: item.code || '', 
      status: item.status === 'active' ? 'active' : 'inactive'
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!isMasterType(type)) return;
    
    if (window.confirm('Are you sure you want to delete this item?')) {
      const adminToken = localStorage.getItem('adminToken');
      
      try {
        const response = await deleteMaster(masterType, id, adminToken || undefined);
        
        if (response.success) {
          setItems(prev => prev.filter(item => item.id !== id));
        } else {
          alert(response.message || 'Failed to delete master');
        }
      } catch (error) {
        console.error('Error deleting master:', error);
        alert('Failed to delete master. Please try again.');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.entries(masterTypes).map(([key, meta]) => (
          <NavLink
            key={key}
            to={`/admin/masters/${key}`}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#14b8a6] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`
            }
          >
            {meta.title.replace(' Master', '')}
          </NavLink>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{config.title}</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-50">
            <span>📥</span> Import Excel
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]"
          >
            + Add New
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{editingItem ? 'Edit' : 'Add New'} {config.title}</h2>
              <button
                onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
              </div>
              {config.fields.includes('code') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                  className="flex-1 py-2.5 px-4 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading masters...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  {config.fields.includes('code') && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Code</th>}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={config.fields.includes('code') ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                      No items found. Click "Add New" to create one.
                    </td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{item.name}</td>
                      {config.fields.includes('code') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.code || '-'}</td>}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            🗑️
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
      )}
    </div>
  );
};

export default MastersPage;
