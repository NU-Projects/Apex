import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';

const ROLES = [
  'Software Engineer', 'Data Scientist', 'Frontend Developer',
  'Backend Developer', 'DevOps Engineer', 'Product Manager',
  'AI/ML Engineer', 'Cyber Security'
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function RoleSelection({ onRoleSelected }) {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!selectedRole) {
      setError('Please select a role to continue.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, role: selectedRole })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('storage'));
        
        onRoleSelected(data.user);

        // Fire background calculation specifically for missing skills seamlessly
        fetch(`${API_URL}/user/missing-skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.user.email })
        })
          .then(res => res.json())
          .then(newData => {
            if (newData.user) {
              localStorage.setItem('user', JSON.stringify(newData.user));
              window.dispatchEvent(new Event('storage'));
            }
          })
          .catch(e => console.error("Missing skills background fetch failed", e));
          
        return;
      }
      
      onRoleSelected({ ...user, role: selectedRole });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-surface font-sans p-4 md:p-8">
      
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col justify-center h-full">
        
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-brand-600 tracking-tighter mb-2 uppercase">APEX</h1>
          <p className="text-text-secondary text-base md:text-lg font-medium max-w-2xl mx-auto">
            Select your target role to personalize your career intelligence overview and market insights.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`p-4 md:p-6 rounded-[20px] border-2 text-center flex flex-col items-center justify-center h-28 md:h-40 outline-none ${
                selectedRole === role 
                  ? 'bg-white border-brand-600 ring-4 ring-brand-500/20 shadow-[0_4px_15px_-3px_rgba(37,99,235,0.2)]' 
                  : 'bg-white border-border-light hover:border-brand-300 hover:shadow-sm'
              }`}
            >
              <h2 className={`text-lg md:text-xl font-black tracking-tight ${selectedRole === role ? 'text-brand-600' : 'text-text-primary'}`}>
                {role}
              </h2>
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm font-bold text-center mb-6 bg-red-50 p-4 rounded-xl max-w-xl mx-auto border border-red-100">{error}</p>}
        
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={loading || !selectedRole}
            className={`px-12 py-4 rounded-xl text-lg font-black tracking-wide w-full md:w-auto outline-none transition-opacity ${
              loading
                ? 'bg-brand-600 text-white opacity-70 cursor-wait shadow-sm'
                : !selectedRole
                ? 'bg-surface border-2 border-border-light text-text-muted cursor-not-allowed shadow-none'
                : 'bg-brand-600 text-white shadow-md hover:bg-brand-700'
            }`}
          >
            {loading ? (
              'Confirming...'
            ) : selectedRole ? (
              `Confirm ${selectedRole}`
            ) : (
              'Waiting for selection'
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}

RoleSelection.propTypes = {
  onRoleSelected: PropTypes.func.isRequired,
};
