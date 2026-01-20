import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import SocialLogin from '../components/auth/SocialLogin';
import FormInput from '../components/ui/FormInput';

export default function Register() {
  return (
    <AuthLayout>
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-slate-500">Join 10,000+ developers automating their workflow.</p>
        </div>
        
        <SocialLogin mode="register" />

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <FormInput 
                id="full-name" 
                label="Full Name" 
                placeholder="Alex Chen" 
            />
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
                    Create Account
                </button>
            </div>
        </form>

        <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-500">
                By registering, you agree to our <a className="text-slate-300 hover:text-white underline underline-offset-4" href="#">Terms of Service</a>.
            </p>
            <div className="pt-6 border-t border-border-dark">
                <p className="text-sm text-slate-500">
                    Already have an account? <Link className="text-primary font-bold hover:text-primary-dark transition-colors" to="/login">Log in</Link>
                </p>
            </div>
        </div>
    </AuthLayout>
  );
}
