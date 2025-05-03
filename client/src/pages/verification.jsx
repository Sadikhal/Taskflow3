
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from '../lib/apiRequest';
import useStore from "../store/useStore";

const EmailVerificationPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { login } = useStore();

    const handleChange = (index, value) => {
        const digit = value.replace(/\D/g, '');
        const newCode = [...code];
        if (digit.length > 1) {
            const digits = digit.split('').slice(0, 6);
            digits.forEach((d, i) => {
                if (i < 6) newCode[i] = d;
            });
        } else {
            newCode[index] = digit;
        }
        setCode(newCode);
        if (digit && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };


    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!code[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const verificationCode = code.join('');
            const { data } = await apiRequest.post('/auth/verify-email', { code: verificationCode });
            login(data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0].focus();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (code.every(digit => digit !== "")) {
            handleSubmit(new Event("submit"));
        }
    }, [code]);

    return (
        <div className="flex items-center justify-center h-screen px-2">
            <div className='max-w-md w-full bg-bgColor border border-slate-200 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden flex justify-center items-center px-2'>
                <div className='rounded-2xl shadow-2xl p-8 w-full max-w-md'>
                    <h2 className='md:text-3xl text-xl font-bold mb-6 text-center'>
                        Verify Your Email
                    </h2>
                    <p className='text-center text-gray-500 mb-6'>
                        Enter the 6-digit code sent to your email address.
                    </p>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='flex justify-between gap-2'>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className='md:w-12 md:h-12 w-9 h-9 border border-gray-300 text-center 
                                               text-lg text-slate-900 bg-white focus:outline-none 
                                               focus:border-blue-500 rounded-sm transition-colors'
                                    disabled={loading}
                                />
                            ))}
                        </div>
                        
                        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}

                        <button
                            type="submit"
                            disabled={loading || code.some(digit => !digit)}
                            className='w-full bg-gradient-to-r from-navColor to-slate-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-cyan-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:cursor-not-allowed
                             '
                        >
                            {loading ? "Verifying..." : "Verify Email"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationPage;