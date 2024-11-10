import React, { useState } from 'react';
import { auth } from '../firebase/FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import './components/Auth.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
      const user = userCredential.user;

      const response = await fetch('https://recipe-finder-zu80.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: user.email }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          username: data.user.username,
        }));
        navigate('/search');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMessage('');

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Password reset email sent! Please check your inbox.');
      setResetEmail('');
    } catch (error) {
      setResetMessage('Error sending password reset email. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: '#1a1a2e', minHeight: '100vh', padding: '20px', color: '#ffffff' }}>
      <div style={{
        maxWidth: '500px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: '#162447',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
        color: '#e5e5e5'
      }}>
        <h2 style={{ color: '#e43f5a', textAlign: 'center', fontSize: '2rem' }}>Login</h2>
        {error && <p style={{ color: '#ff6f61', textAlign: 'center' }}>{error}</p>}
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label style={{ color: '#e43f5a' }}>Email</Form.Label>
            <Form.Control
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{
                padding: '10px',
                backgroundColor: '#1f4068',
                border: '1px solid #1b1b2f',
                borderRadius: '5px',
                color: '#ffffff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                transition: 'box-shadow 0.3s'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 4px 12px rgba(3, 218, 198, 0.5)'}
              onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)'}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label style={{ color: '#e43f5a' }}>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '10px',
                backgroundColor: '#1f4068',
                border: '1px solid #1b1b2f',
                borderRadius: '5px',
                color: '#ffffff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                transition: 'box-shadow 0.3s'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 4px 12px rgba(3, 218, 198, 0.5)'}
              onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)'}
            />
          </Form.Group>
          <br />
          <p style={{ color: '#e43f5a' }}>Create a new account? <a href='/signup' style={{ color: '#03dac6' }}>Signup</a></p>
          <Button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#e43f5a',
            border: 'none',
            borderRadius: '5px',
            color: '#ffffff',
            boxShadow: '0 4px 8px rgba(228, 63, 90, 0.4)',
            transition: 'background-color 0.3s, transform 0.2s'
          }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d63251'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e43f5a'}
          >
            Login
          </Button>
        </Form>

        <div className="mt-3">
          <p onClick={() => setShowResetForm(!showResetForm)} style={{ cursor: 'pointer', color: '#03dac6', textDecoration: 'underline' }}>
            Forgot your password?
          </p>
        </div>

        {showResetForm && (
          <div className="mt-3">
            <p style={{ color: '#e5e5e5' }}>Enter your email to reset your password</p>
            <Form onSubmit={handlePasswordReset}>
              <Form.Group>
                <Form.Control
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    padding: '10px',
                    backgroundColor: '#1f4068',
                    border: '1px solid #1b1b2f',
                    borderRadius: '5px',
                    color: '#ffffff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                    transition: 'box-shadow 0.3s'
                  }}
                  onFocus={(e) => e.target.style.boxShadow = '0 4px 12px rgba(3, 218, 198, 0.5)'}
                  onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)'}
                />
              </Form.Group>
              <Button type="submit" className="mt-2" style={{
                backgroundColor: '#03dac6',
                border: 'none',
                borderRadius: '5px',
                color: '#121212',
                width: '100%',
                padding: '10px',
                boxShadow: '0 4px 8px rgba(3, 218, 198, 0.4)',
                transition: 'background-color 0.3s, transform 0.2s'
              }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#02808d'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#03dac6'}
              >
                Reset Password
              </Button>
              {resetMessage && <p className="text-success" style={{ marginTop: '10px' }}>{resetMessage}</p>}
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
