import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { addDoc, collection, doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, provider } from "../firebase-config";

import {
	BrowserRouter as Router,
	Route,
	Routes,
	Link,
	useNavigate
  } from "react-router-dom";

import { FaUserAlt } from 'react-icons/fa';
import { MdOutlineLogout } from 'react-icons/md';
import { IoChevronBack, IoPersonCircleOutline } from 'react-icons/io5';

var logo = require('../assets/codluc.png');

function Login(props) {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [passwordError, setPasswordError] = useState("");

  const [user, setUser] = useState({});
  useEffect(()=>onAuthStateChanged(auth,(currentUser)=>{setUser(currentUser);}),[ ])

  const register = async () => {
    try {
      console.log(auth, loginEmail, loginPassword)
      const user = await createUserWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      ).then(cred => {
        const data = { email: loginEmail, money: 0}
        const usersCollectionRef = doc(db, "users", auth.currentUser.uid);
        return setDoc(usersCollectionRef, data);
      });
      navigate('/');
    } catch (error) {
      console.log(error.message);
      if (error.message.includes('email-already-in-use')) {
        login()
        console.log('login')
      }
    }
  };

  const login = async () => {
    try {
      console.log(auth, loginEmail, loginPassword)
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword,
      );
	  navigate('/')
    } catch (error) {
      console.log(error.message);

      if (error.message.includes('invalid-email')) {
        setEmailError('Email não é válido.');
      }  else if (error.message.includes('user-not-found')) {
        setEmailError('Email não é válido.');  
      } else if (error.message.includes('wrong-password')) {
        setPasswordError('Senha não é válida.');  
      } else {
        setEmailError('');
      }
    }
  };

  return (
    <>
        <div className="loginWhiteWrapper">
          <div className="loginCardWrapper">
            <img width={130} src="https://whatspix.tech/cpapp/images/logo_whats.png" alt="" />
            <h2>Bem-vindo(a) ao WhatsPIX</h2>
            <p>Insira seu e-mail para prosseguir!</p>
            <div className="inputEmail">
              <input
                  style={{border: 'none', paddingLeft: 10, width: '100%', textAlign: "center", fontSize: 16}}
                  placeholder="E-mail utilizado na compra"
                  onChange={(event) => {
                    setLoginEmail(event.target.value);
              }}/> 
            </div>

            <label className="labelError">{emailError}</label>
            <button className="buttonGreen" onClick={register}>ENTRAR</button>
            <p style={{fontWeight: 'bold', color: "rgb(101, 101, 101)"}} onClick={() => {window.open('https://go.perfectpay.com.br/PPU38CNS4NM')}}>Não possui uma conta? <span style={{color: '#28a745'}}>Clique aqui</span></p>
          </div>
        </div>
        <p style={{fontSize: 15, position: "fixed", bottom: 0, width: "100%", color: "rgb(101, 101, 101)"}}>
         2024 © WhatsApp LLC <br />
         Termos e Política de Privacidade
        </p>
    </>

        
  );
}

export default Login;