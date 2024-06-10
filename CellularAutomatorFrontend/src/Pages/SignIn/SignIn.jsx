import React, { useState } from 'react';
import axios from 'axios';

function SignIn({apiURL, setSignedInUser}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleChangeEmail(event) {
    setEmail(event.target.value);
  }

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const res = await axios.post(apiURL + '/auth/signin', {
          email,
          password
      });
      localStorage.setItem('userToken', res.data.token);
      setSignedInUser(email);
      setMessage('Signed in successfully');
    } catch (err) {
        console.error(err.response.data);
        setMessage('Failed to sign in - wrong credentials');
    }
  }

  return (
    <div className="AuthForm">
        <h2>Sign in</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" placeholder="Email" name="email" value={email} onChange={(e) => handleChangeEmail(e)} required />
            <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => handleChangePassword(e)} required />
            <button type="submit">Sign in</button>
        </form>
        <p className="message">{message}</p>
    </div>
  )
}

export default SignIn