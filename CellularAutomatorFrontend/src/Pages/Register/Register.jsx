import React, { useState } from 'react'

function Register({apiURL, setSignedInUser}) {
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
      const res = await axios.post(apiURL + '/auth/register', {
          email,
          password
      });
      setMessage('Registered successfully'); // Set success message
    } catch (err) {
        console.error(err.response.data);
        setMessage('Failed to register, User already exists'); // Set error message
    }
  }

  return (
    <div className="AuthForm">
        <h2>Register</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" placeholder="Email" name="email" value={email} onChange={(e) => handleChangeEmail(e)} required />
            <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => handleChangePassword(e)} required />
            <button type="submit">Register</button>
        </form>
        <p className="message">{message}</p>
    </div>
  )
}

export default Register