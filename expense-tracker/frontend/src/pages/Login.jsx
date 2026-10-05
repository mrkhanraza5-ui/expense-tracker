import { useState } from 'react';
import Icon from '../components/Icon';
import { useAuth } from '../auth';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@') || password.length < 4) {
      setErr('Enter a valid email and password (min 4 characters).'); return;
    }
    login(email);
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="brand light">
          <span className="brand-ico"><Icon name="clock" size={20} /></span>
          <div><strong>ExpenseWise</strong></div>
        </div>
        <span className="login-tag">PERSONAL FINANCE, SIMPLIFIED</span>
        <h2>Track your money. Understand your spending. Take control.</h2>
        <p>A clear, private place for expenses, income, budgets, and reports.</p>
        <small>Built for better everyday money decisions.</small>
      </div>

      <div className="login-right">
        <form className="login-box" onSubmit={submit}>
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in to your account</h2>
          <p className="muted">Your financial overview is waiting.</p>

          {err && <div className="banner">{err}</div>}

          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 placeholder="you@example.com" />

          <label>Password</label>
          <div className="pw">
            <input type={show ? 'text' : 'password'} value={password}
                   onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
            <button type="button" onClick={() => setShow((s) => !s)}>{show ? '🙈' : '👁️'}</button>
          </div>

          <button className="btn-primary wide">Sign in</button>
          <div className="divider">OR</div>
          <button type="button" className="btn-outline wide"
                  onClick={() => login(email || 'raza@gmail.com')}>
            G&nbsp; Continue with Google
          </button>
          <p className="muted small">Demo mode: any valid email + 4-char password works. Google button is UI demo.</p>
          <p className="muted small">New to ExpenseWise? <a href="#" onClick={(e) => { e.preventDefault(); login(email || 'raza@gmail.com'); }}>Create account</a></p>
        </form>
      </div>
    </div>
  );
}