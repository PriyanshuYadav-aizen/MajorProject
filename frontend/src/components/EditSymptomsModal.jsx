import { useState } from 'react';

const EditSymptomsModal = ({ symptoms, onClose, onSave }) => {
  const [currentSymptoms, setCurrentSymptoms] = useState(symptoms || []);
  const [newSymptom, setNewSymptom] = useState({
    description: '',
    date: '',
    severity: 'Mild'
  });

  const handleAdd = () => {
    if (newSymptom.description.trim()) {
      setCurrentSymptoms([...currentSymptoms, { ...newSymptom }]);
      setNewSymptom({ description: '', date: '', severity: 'Mild' });
    }
  };

  const handleRemove = (index) => {
    setCurrentSymptoms(currentSymptoms.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ healthProfile: { symptoms: currentSymptoms } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Symptoms</h2>
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
            {/* Current Symptoms */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Symptoms
              </label>
              {currentSymptoms.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No symptoms recorded</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {currentSymptoms.map((symptom, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-orange-400 pl-4 py-2 bg-orange-50 rounded flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{symptom.description}</p>
                        <div className="flex gap-4 mt-1">
                          {symptom.date && (
                            <span className="text-xs text-gray-600">
                              {new Date(symptom.date).toLocaleDateString()}
                            </span>
                          )}
                          {symptom.severity && (
                            <span className="text-xs text-gray-600">
                              Severity: {symptom.severity}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="text-red-500 hover:text-red-700 transition ml-2"
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

            {/* Add New Symptom */}
            <div className="mb-6 border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Symptom
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newSymptom.description}
                  onChange={(e) => setNewSymptom({ ...newSymptom, description: e.target.value })}
                  placeholder="Describe the symptom"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={newSymptom.date}
                    onChange={(e) => setNewSymptom({ ...newSymptom, date: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                  <select
                    value={newSymptom.severity}
                    onChange={(e) => setNewSymptom({ ...newSymptom, severity: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-sky-600 transition"
                >
                  Add Symptom
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

export default EditSymptomsModal;