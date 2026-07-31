import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import { registerUser } from '../../features/auth/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async ({ name, email, password }) => {
    setError('');
    setLoading(true);

    try {
      const response = await register({ username: name, email, password });
      const user = { name, email };
      const token = response?.data?.token || '';

      dispatch(registerUser({ user, token }));
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Create account</h2>
      <Input label="Name" error={errors.name?.message} {...registerField('name', { required: 'Name is required' })} />
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...registerField('email', { required: 'Email is required' })}
      />
      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...registerField('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </Button>
      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-slate-900 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
