import { useState } from 'react';

const EditConditionsModal = ({ title, items, field, onClose, onSave }) => {
  const [currentItems, setCurrentItems] = useState(items || []);
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim() && !currentItems.includes(newItem.trim())) {
      setCurrentItems([...currentItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemove = (index) => {
    setCurrentItems(currentItems.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ healthProfile: { [field]: currentItems } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Current Items */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current {title.replace('Edit ', '')}
              </label>
              {currentItems.length === 0 ? (
                <p className="text-sm text-gray-500 italic">None added yet</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {currentItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                    >
                      <span className="text-sm text-gray-900">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Item */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Enter ${title.replace('Edit ', '').toLowerCase()}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-sky-600 transition"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-sky-600 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditConditionsModal;