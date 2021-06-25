import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import { useState } from 'react'
import api from '../config/telegramapi'
import Router from 'next/router'
import * as React from "react";
import Select from 'react-select';



async function getUser() {
  try {
    const user = await api.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};



async function getGContacts() {
  try {
    const userGroupsAndChannels = await api.call('contacts.getContacts', { 
      hash: 0
    });

    return userGroupsAndChannels;
  } catch (error) {
    return null;
  }
};

async function getGroupsAndChannels() {
  try {
    // const userGroupsAndChannels = await api.call('channels.getChannels', { });
    // const userGroupsAndChannels = await api.call('channels.getGroupsForDiscussion', { });
    const userGroupsAndChannels = await api.call('messages.getAllChats', { except_ids: [] });

    return userGroupsAndChannels;
  } catch (error) {
    return null;
  }
};

async function getGroupsAndChannelsMessages() {
  try {
    const userGroupsAndChannels = await api.call('messages.getAllChats', { });

    return userGroupsAndChannels;
  } catch (error) {
    return null;
  }
};

async function sendMessage(messageReceiver) {
  try {
    let receiver = messageReceiver;

    receiver.forEach(async(element) => {
      let messageResult = await api.call('messages.sendMessage', {
        message: {
          _: 'inputUserSelf',
        },
        peer: {
          _: 'inputUserSelf',
        },
      });
    });
    

    return messageResult;
  } catch (error) {
    return null;
  }
};

// // This gets called on every request
// export async function getStaticProps() {
//   // Fetch data from external API
//   // const res = await fetch(`https://.../data`)
//   // const res = await getGroupsAndChannels();
//   const res = await getGContacts();
//   const data = res != null && res != undefined ? await res.json() : [];

//   console.log("res "+res);
//   console.log("data "+data);

//   if (!data) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   // Pass data to the page via props
//   return { props: { data } };
// }

// // This gets called on every request
// export async function getServerSideProps() {
//   // Fetch data from external API
//   // const res = await fetch(`https://.../data`)
//   const res = await getGroupsAndChannels();
//   const data = await res.json();

//   if (!data) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   // Pass data to the page via props
//   return { props: { data } };
// }


export default function CreatePost({data}) {

  const [userData, setUserData] = useState({
    text_to_send: '',
    phone_number: '',
    phone_code: '',
    phone_code_hash: '',
    groups_channels: [],
    data: [],
    selectedOption: null,
    resendCodeVal: '',
    error: '',
  });

  React.useEffect(async () => {
    // window is accessible here.
    // const res = await getGContacts();
    const res = await getGroupsAndChannels();
    if (res != null && res != undefined) {
      //const data = res.users;
      console.log("res ");
      console.log(res);
    // const data = res.chats.filter(x => x.default_banned_rights != undefined && x.default_banned_rights.send_messages == true);
    // const data = res.chats.filter(x => x.title.contains('ejara'));
    const data = res.chats;
    console.log(data);
    setUserData({ ...userData, data: data });
      // const data = res != null && res != undefined ? await res.json() : [];
      
      if (!data) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

      // Pass data to the page via props
      // return { props: { data } };
      return { props: { data } };
    }

      return { props: { } };

  }, []);

  

  const generatedNumber = "+9996629641";

  function handleChange(selectedOption)  {
    setUserData({ ...userData, selectedOption: selectedOption });
    console.log(`Option selected:`, selectedOption);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setUserData({ ...userData, error: '' });
    setUserData({ ...userData, resendCodeVal: '' });

    let pcode_hash = userData.phone_code_hash;
    let resendCodeVal = userData.resendCodeVal;


    try {
      
      
    } catch (error) {
      console.error(error)
      setUserData({ ...userData, error: error.message });
      
      
      if (error.error_message !== 'SESSION_PASSWORD_NEEDED') {
        console.log(`error:`, error);

        return;
      }
    }
  }
  
  const options = userData.data.map(x => { let rObj = { value : x.title, label: x.title }
    
    return rObj });
    
  // const options = 
  //   [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' }
  // ];

  return (
    <Layout>
      <h1 className="title">
         Create Post
        </h1>


        <div className="grid">


        <form onSubmit={handleSubmit}>
          <label htmlFor="phone_number"> Text To Send </label>

          <input
            type="text"
            id="text_to_send"
            name="text_to_send"
            value={userData.text_to_send}
            onChange={(event) =>
              setUserData(
                Object.assign({}, userData, { text_to_send: event.target.value })
              )
            }
          />

<Select
        value={userData.selectedOption}
        onChange={handleChange}
        options={options}
      />

          
          <button type="submit">Send Message </button> 

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
