import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { apiRequest } from '../lib/apiRequest';
import { useForm } from 'react-hook-form';
import InputField from '../components/ui/InputField';
import useStore from '../store/useStore';

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, setCurrentProject } = useStore();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.post('/auth/login', formData);
      login(data.user, data.projects);
      console.log(data)
      if (data.projects.length > 0) {
        setCurrentProject(data.projects[0]);
        navigate(`/project/${data.projects[0]._id}/home`);
      } else {
        navigate('/project');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full xl:h-screen flex items-center justify-center'>
      <div className='xl:w-[60%] w-80 sm:w-96 md:w-[40%] xl:h-[90%] justify-center items-center h-full text-center flex flex-col-reverse xl:flex-row shadow-2xl xl:mb-0 mt-2 mb-4 xl:mt-0 py-8 xl:py-0'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex justify-center items-center '>
          <div className='flex justify-center items-center xl:w-[85%] w-full xl:pr-6 pr-2'>
            <div className='flex justify-center text-center w-full flex-col gap-5 xl:gap-8 items-center'>
              <div className='font-bold capitalize md:leading-10 md:text-[28px] xl:w-[90%] text-xl pt-5 xl:pt-8'>
                Sign In to Your Account
              </div>
              
              <div className='w-full flex animate-slide-in justify-center items-center flex-col '>
                <div className='font-normal w-full items-center justify-center gap-5 text-base flex flex-col '>
                  <InputField
                    label="Email"
                    name="email"
                    register={register}
                    error={errors?.email}
                  />

                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    error={errors?.password}
                  />
                </div>

                <div className='pt-2 flex flex-col gap-5 justify-center items-center'>
                  <button className="underline-offset-2 pt-2 text-textBlack underline font-bold text-sm">
                    <Link to="/forgot-password">
                      Forgotten password?
                    </Link>
                  </button>
                  
                  <Button
                    className="rounded-full w-56 py-6 bg-textBlue uppercase hover:bg-textBlue/80 text-bgColor"
                    type="submit"
                    size="xl"
                  >
                    {loading ? 'Loading...' : 'Sign in'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div 
          style={{ backgroundImage: "url('/bg.jpg')" }} 
          className='bg-cover xl:max-h-none max-h-96 xl:h-full justify-center items-center text-center flex xl:w-[40%] h-full bg-no-repeat aspect-square rounded-t-lg xl:rounded-t-none'
        >
          <div className='flex justify-center flex-col gap-3 w-[80%]'>
            <div className='font-bold capitalize text-bgColor text-[28px] md:text-[33px]'>Hello friend!</div>
            <div className='font-normal text-[15px] md:text-base text-bgColor/75'>
              Enter your personal details and start your journey with us
            </div>
            <div className='pt-8'>
              <Button asChild variant="outline" size="xl">
                <Link to="/register" className='text-bgColor uppercase'>
                  Sign up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;