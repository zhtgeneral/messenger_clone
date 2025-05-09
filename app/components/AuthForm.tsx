'use client'

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import AuthSocialButton from "@/app/components/AuthSocialButton";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import React from "react";

type Variant = 'LOGIN' | 'REGISTER'

/**
 * This component is handles user authentication and account regisration.
 * 
 * It displays a form in login or register mode, defaulting on login.
 * On login mode, it shows the inputs `email` and `password` allowing the user to login.
 * 
 * On register mode, it shows the inputs `name`, `email` and `password`
 * allowing the user to create an account.
 * 
 * On either mode it shows the social logins available that the user can use.
 * The choices for social logins are `google` and `github`.
 */
export default function AuthForm() {
  const session = useSession();
  const router = useRouter();

  const [variant, setVariant] = React.useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (session?.status == 'authenticated') {
      router.push('/users')
    }
  }, [session?.status, router])

  const toggleVariant = useCallback(() => {
    setVariant((variant == 'LOGIN')? 'REGISTER': 'LOGIN');
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  /**
   * This helper function handles submitting data of the form.
   * 
   * First set the loading state to true.
   * 
   * If the user attempts to register, sent a `POST` request to `/api/register`
   * and sign the user in `credentials` method using NextAuth.
   * If an error occurs during backend request or NextAuth login, 
   * notify the user with a toaster displaying 'Something went wrong'.
   * 
   * If the user attempts to login, 
   * sign the user in using `credentials` method using NextAuth.
   * If an error occurs, notify the user with a toaster displaying 'Invalid Credentials'.
   * Otherwise, if the login was successful, 
   * notify the user with a toaster displaying 'Logged in' 
   * and redirect the user to `/users`.
   * 
   * Then remove the loading state.
   * @param data the form data
   */
  function onSubmit(data: any): void {
    setIsLoading(true);
    switch (variant) {
      case 'REGISTER': {
        axios.post('/api/register', data)
        .then(() => { signIn('credentials', data) })
        .catch(() => toast.error('Something went wrong'))
        .finally(() => setIsLoading(false));
        break;
      }
      case 'LOGIN': {
        signIn('credentials', {
          ...data,
          redirect: false,
        })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid Credentials');
          }
          if (callback?.ok && !callback?.error) {
            toast.success('Logged in');
            router.push('/users')
          }
        })
        .finally(() => setIsLoading(false));
        break;
      }
      default: {}
    }
  }

  /**
   * This helper function handles logging a user in for social logins.
   * 
   * It sets the state as loading and logs the user in using NextAuth.
   * 
   * Once sign in is complete, it checks if an error occured.
   * If an error has occured, notify the user with a toaster displaying 'Invalid Credentials'.
   * 
   * Otherwise notify the user with a toaster displaying 'Logged In' 
   * and redirect the user to `/users`.
   * 
   * Finally, remove the loading state.
   * 
   * @param action a string representing the login provider type.
   */
  function socialAction(action: string): void {
    setIsLoading(true);
    signIn(action, { redirect: false })
    .then((callback) => {
      if (callback?.error) {
        toast.error('Invalid Credentials');
      }
      if (callback?.ok && !callback?.error) {
        toast.success('Logged In');
        router.push('/users');
      }
    })
    .finally(() => setIsLoading(false));
  }

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div id="authForm" className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant == 'REGISTER' && (
            <Input 
              label='Name'
              id='name'
              register={register} 
              errors={errors} 
              disabled={isLoading}
            />
          )}
          <Input 
            label='Email' 
            id='email'
            register={register} 
            errors={errors} 
            disabled={isLoading}
          />
          <Input 
            label='Password' 
            id='password' 
            register={register} 
            errors={errors} 
            disabled={isLoading} 
            type='password'
          />
          <div>
            <Button disabled={isLoading} fullWidth type='submit'>
              {variant == 'LOGIN'? 'Sign in': 'Register'}
            </Button>
          </div>
        </form> 
        <div className='mt-6'>
          <div className='relative'>
            <div className="absolute inset-0 flex items-center">
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>
          <div className='mt-6 flex gap-2'>
            <AuthSocialButton type="GITHUB" onClick={() => socialAction('github')}/>
            <AuthSocialButton type="GOOGLE" onClick={() => socialAction('google')}/>
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant == 'LOGIN'? 'New to Messenger?': 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {variant == 'LOGIN'? 'Create an account': 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}