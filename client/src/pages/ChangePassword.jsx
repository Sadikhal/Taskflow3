import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from '../lib/apiRequest';

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const res = await apiRequest.post(`/auth/reset-password/${token}`, { password });
      navigate("/login");
    } catch (error) {
      setError(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen px-2">
      <div className='max-w-md w-full g-bgColor border border-slate-200 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
        <div className='p-8'>
          <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-800 to-emerald-500 text-transparent bg-clip-text'>
            Reset Password
          </h2>
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
              type='password'
              placeholder='New Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              className="peer h-10 mt-5 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
              type='password'
              placeholder='Confirm New Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              className='w-full py-3 mt-5 px-4 text-bgColor transition duration-200 bg-navColor hover:bg-navColor/60 cursor-pointer'
              type='submit'
              disabled={loading}
            >
              {loading ? "Resetting..." : "Set New Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;