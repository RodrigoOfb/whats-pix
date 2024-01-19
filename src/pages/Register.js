import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithGoogle,
} from "firebase/auth";

import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { IoArrowBackOutline } from 'react-icons/io5';

import { MdOutlineLogout } from 'react-icons/md';
import { IoChevronBack, IoPersonCircleOutline } from 'react-icons/io5';

import {
	BrowserRouter as Router,
	Route,
	Routes,
	Link,
  useNavigate,
  } from "react-router-dom";

import toast, { Toaster } from 'react-hot-toast';

const registerSuccess = () => toast('Parabéns, seu cadastro foi efetuado com sucesso ✅. Faça login para acessar o aplicativo!');

function Register(props) {
  const navigate = useNavigate();
  const [registerEmail, setRegisterEmail] = useState("");
  const registerPassword = "password";

  const [user, setUser] = useState({});

  useEffect(()=>onAuthStateChanged(auth,(currentUser)=>{setUser(currentUser);}),[ ])
  const register = async () => {
    try {
      console.log(auth, registerEmail, registerPassword)
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      ).then(cred => {
        const data = { email: registerEmail, money: 0}
        const usersCollectionRef = doc(db, "users", auth.currentUser.uid);
        return setDoc(usersCollectionRef, data);
      });

        registerSuccess();


    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="loginWhiteWrapper">
    <div className="loginHeader">
      <IoChevronBack onClick={() => {navigate('/login')}} size={30} />
    </div>
    <div className="loginEnterWrapper">
      <h2 style={{fontSize: 30}}>Cadastre-se!</h2>
      <div className="inputEmail">
        <IoPersonCircleOutline size={30} />
        <input
            style={{border: 'none'}}
            placeholder="E-mail"
            onChange={(event) => {
                setRegisterEmail(event.target.value);
        }}/> 
      </div>
      <button className="buttonBlack" style={{marginBottom: 20}} onClick={() => {register()}}>Cadastrar</button>
      <Link to="/login" className="linkUnderline">Já tem uma conta? Login</Link>
    </div>
    <Toaster />
  </div>
  );
}

export default Register;