// Client-side Register component (src/pages/Register.jsx)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { apiRequest } from '../lib/apiRequest';
import { useForm, Controller } from 'react-hook-form'; 
import InputField from '../components/ui/InputField';
import i18n from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { BiChevronDown } from 'react-icons/bi';
i18n.registerLocale(en);

function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const countryList = i18n.getNames('en');

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.post('/auth/register', formData);
      navigate('/verify-email');  
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error(err);
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
                Create Your Account
              </div>
              
              <div className='w-full flex animate-slide-in justify-center items-center flex-col '>
                <div className='font-normal w-full items-center justify-center gap-5 text-base flex flex-col '>
                  <InputField
                    label="Name"
                    name="name"
                    register={register}
                    error={errors?.name}
                    required
                  />
                
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors?.email}
                    required
                  />

                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    error={errors?.password}
                    required
                    minLength={6}
                  />

                  <div className="relative font-poppins text-xs w-full">
                    <Controller
                      name="country"
                      control={control}
                      rules={{ required: 'Country is required' }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm flex flex-row justify-between items-center">
                            <SelectValue placeholder="Select Country" />
                            <BiChevronDown className="h-4 w-4" />
                          </SelectTrigger>
                          <SelectContent className="bg-bgColor">
                            <SelectGroup>
                              {Object.entries(countryList).map(([code, name]) => (
                                <SelectItem key={code} value={name}>
                                  {name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors?.country && (
                      <p className="text-xs text-red-400">{errors.country.message}</p>
                    )}
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className='pt-2 flex flex-col gap-5 justify-center items-center'>
                  <Button
                    className="rounded-full w-56 py-6 bg-textBlue uppercase hover:bg-textBlue/80 text-bgColor"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Register'}
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
                <Link to="/login" className='text-bgColor uppercase'>
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;