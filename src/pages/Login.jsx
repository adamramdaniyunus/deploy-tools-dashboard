import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import SocialLogin from '../components/auth/SocialLogin';
import FormInput from '../components/ui/FormInput';

export default function Login() {
  return (
    <AuthLayout showSidebar={false}>
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-500">Enter your credentials to access your account.</p>
        </div>
        
        <SocialLogin mode="login" />

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <FormInput 
                id="email" 
                type="email" 
                label="Email Address" 
                placeholder="alex@company.com" 
            />
            <FormInput 
                id="password" 
                type="password" 
                label="Password" 
                placeholder="••••••••" 
            />
            
            <div className="pt-2">
                <button className="w-full bg-primary/10 text-primary border border-primary/20 font-bold py-3 rounded-lg transition-all hover:bg-primary/20 active:scale-[0.98]">
                    Log In
                </button>
            </div>
        </form>

        <div className="mt-8 text-center space-y-4">
             {/* Forgot Password Link could go here */}
            
            <div className="pt-6 border-t border-border-dark">
                <p className="text-sm text-slate-500">
                    Don't have an account? <Link className="text-primary font-bold hover:text-primary-dark transition-colors" to="/register">Sign up</Link>
                </p>
            </div>
        </div>
    </AuthLayout>
  );
}
