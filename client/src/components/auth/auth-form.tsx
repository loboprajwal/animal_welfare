import React, { useState } from 'react';
import LoginForm from './login-form';
import RegisterForm from './register-form';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create an account'}
        </h3>
      </div>
      
      {isLogin ? (
        <LoginForm />
      ) : (
        <RegisterForm />
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="ml-1 font-medium text-primary hover:text-primary-dark"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
