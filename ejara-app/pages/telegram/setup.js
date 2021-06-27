import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import { useState } from 'react'
import api from '../config/telegramapi'
import Router from 'next/router'


function sendCode(phone) {
  return api.call('auth.sendCode', {
    phone_number: phone,
    settings: {
      _: 'codeSettings',
      allow_flashcall : true,
      current_number: true,
      allow_app_hash: true
    },
  });
};

function resendCode({phone, phone_code_hash }) {
  console.log("phone_code_hash: "+phone_code_hash)
  return api.call('auth.resendCode', {
    phone_number: phone,
    phone_code_hash: phone_code_hash,
  });
};

function signIn({ phone, phone_code_hash ,phone_code }) {
  console.log(phone);
  console.log(phone_code_hash);
  console.log(phone_code);
  return api.call('auth.signIn', {
    phone_number: phone,
    phone_code_hash: phone_code_hash,
    phone_code: phone_code
  });
}

function signUp({ phone, phone_code_hash }) {
  return api.call('auth.signUp', {
    phone_number: phone,
    phone_code_hash: phone_code_hash,
    first_name: 'smartbotejara',
    last_name: 'Smbejara',
  });
}




export default function SetupTelegram() {

  const [userData, setUserData] = useState({
    phone_number: '',
    phone_code: '',
    phone_code_hash: '',
    resendCodeVal: '',
    error: '',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setUserData({ ...userData, error: '' });
    setUserData({ ...userData, resendCodeVal: '' });

    const phone_number = userData.phone_number;
    const phone_code = userData.phone_code;
    let pcode_hash = userData.phone_code_hash;
    let resendCodeVal = userData.resendCodeVal;


    try {
      if ( pcode_hash === '' || pcode_hash == null || pcode_hash == undefined) {
        pcode_hash = await sendCode(phone_number);
        setUserData({ ...userData, phone_code_hash: pcode_hash });
      }
      else if ( resendCodeVal === 'true') {

        let pcode_hash2 = await resendCode({
            phone : phone_number,
            phone_code_hash: pcode_hash.phone_code_hash
          });
        setUserData({ ...userData, phone_code_hash: pcode_hash2 });

      } else {
        
        const signInResult = await signIn({
          phone: phone_number,
          phone_code_hash: pcode_hash.phone_code_hash,
          phone_code: phone_code,
        });
        
        if (signInResult._ === 'auth.authorizationSignUpRequired') {
          await signUp({
            phone_number,
            pcode_hash,
          });
        }
        alert('Login Succesful');
        Router.push('/telegram/createpost');

      }
      
    } catch (error) {
      console.error(error)
      setUserData({ ...userData, error: error.message });
      if (userData.phone_code_hash == undefined || userData.phone_code_hash == '') {
        setUserData({ ...userData, resendCodeVal: 'true' });
      }
      if (error.error_message !== 'SESSION_PASSWORD_NEEDED') {
        console.log(`error:`, error);

        return;
      }
    }
  }
  
  return (
    <Layout>
      <h1 className="title">
         Setup Telegram
        </h1>


        <div className="grid">


        <form onSubmit={handleSubmit}>
          <label htmlFor="phone_number">Phone Number</label>

          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={userData.phone_number}
            onChange={(event) =>
              setUserData(
                Object.assign({}, userData, { phone_number: event.target.value })
              )
            }
          />
          
          { userData.phone_code_hash && (
            <div>
              <label htmlFor="phone_code">Confirmation Code</label>

<input
  type="text"
  id="phone_code"
  name="phone_code"
  value={userData.phone_code}
  onChange={(event) =>
    setUserData(
      Object.assign({}, userData, { phone_code: event.target.value })
    )
  }
/>
            </div>
          )
}
        

{ !userData.phone_code_hash && <button type="submit">Send Code </button> }
          { userData.phone_code_hash && <button type="submit">Login</button> }
          { userData.resendCodeVal == 'true' && <button type="submit">Resend Code</button> }

          {userData.error && <p className="error">Error: {userData.error}</p>}
        </form>

        </div>

        <style jsx>{`
      .container {
        min-height: 100vh;
        padding: 0 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      main {
        padding: 5rem 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      footer {
        width: 100%;
        height: 100px;
        border-top: 1px solid #eaeaea;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      footer img {
        margin-left: 0.5rem;
      }

      footer a {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .title a {
        color: #0070f3;
        text-decoration: none;
      }

      .title a:hover,
      .title a:focus,
      .title a:active {
        text-decoration: underline;
      }

      .title {
        margin: 0;
        line-height: 1.15;
        font-size: 4rem;
      }

      .title,
      .description {
        text-align: center;
      }

      .description {
        line-height: 1.5;
        font-size: 1.5rem;
      }

      code {
        background: #fafafa;
        border-radius: 5px;
        padding: 0.75rem;
        font-size: 1.1rem;
        font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
          DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
      }

      .grid {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        max-width: 800px;
        margin-top: 3rem;
      }

      .card {
        margin: 1rem;
        flex-basis: 45%;
        padding: 1.5rem;
        text-align: left;
        color: inherit;
        text-decoration: none;
        border: 1px solid #eaeaea;
        border-radius: 10px;
        transition: color 0.15s ease, border-color 0.15s ease;
      }

      .card:hover,
      .card:focus,
      .card:active {
        color: #0070f3;
        border-color: #0070f3;
      }

      .card h3 {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
      }

      .card p {
        margin: 0;
        font-size: 1.25rem;
        line-height: 1.5;
      }

      .logo {
        height: 1em;
      }

      @media (max-width: 600px) {
        .grid {
          width: 100%;
          flex-direction: column;
        }
      }
    `}</style>

    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
          Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
          sans-serif;
      }

      * {
        box-sizing: border-box;
      }
    `}</style>

    </Layout>
    )
}
