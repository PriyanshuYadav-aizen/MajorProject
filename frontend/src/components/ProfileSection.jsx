const ProfileSection = ({ title, icon, onEdit, children, fullWidth }) => {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${fullWidth ? 'lg:col-span-2' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onEdit}
            className="text-primary hover:text-sky-700 text-sm font-medium flex items-center gap-1 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>
        {children}
      </div>
    );
  };
  
  export default ProfileSection;