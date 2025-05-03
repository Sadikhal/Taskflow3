import { useState } from "react";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from '../lib/apiRequest';

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate()


	const handleSubmit = async (e) => {
		e.preventDefault();
    setLoading(true);
    try{
      const  res  = await apiRequest.post("/auth/forgot-password",{email});
      setIsSubmitted(true);
			navigate("/login")

    }catch (error){
      setError(error);
      console.error(error);
    }finally{
      setLoading(false);
    }
	  
	};

	return (
		<div className="flex items-center justify-center h-screen px-2">
		<div	
			className='max-w-md w-full g-bgColor border border-slate-200 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-800 to-emerald-500 text-transparent bg-clip-text'>
					Forgot Password
				</h2>

				{!isSubmitted ? (
					<form onSubmit={handleSubmit}>
						<p className='text-gray-500 mb-6 text-center'>
							Enter your email address and we'll send you a link to reset your password.
						</p>
						<input
							className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm "
							type='email'
							placeholder='Email Address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<button
							className='w-full py-3 px-4 mt-4 bg-navColor hover:bg-navColor/60 cursor-pointer text-bgColor'
							type='submit'
						>
							{loading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"}
						</button>
					</form>
				) : (
					<div className='text-center'>
						<div
							
							className='w-16 h-16 bg-navColor rounded-full flex items-center justify-center mx-auto mb-4'
						>
							<Mail className='h-8 w-8 text-white' />
						</div>
						<p className='text-gray-800 mb-6'>
							If an account exists for {email}, you will receive a password reset link shortly.
						</p>
					</div>
				)}
			</div>

			<div className='px-8 py-4 bg-[#deebe7] bg-opacity-50 flex justify-center'>
				<Link to={"/login"} className='text-sm text-slate-900 hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
				</Link>
			</div>
		</div>
		</div>
	);
};
export default ForgotPasswordPage;