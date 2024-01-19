import { useState, useEffect, useMemo } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import axios from "axios";

import { Link, Navigate, useNavigate } from "react-router-dom";

import { getDoc, getDocs, doc, collection, DocumentReference, querySnapshot, onSnapshot, updateDoc, limit } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import uuid from 'react-uuid';

import { IoChevronBack, IoPersonCircleOutline, IoWallet } from 'react-icons/io5';

import { RiSmartphoneFill, RiHeartLine, RiHeartFill } from 'react-icons/ri';
import { AiOutlineLoading3Quarters, AiTwotoneDislike, AiTwotoneLike } from 'react-icons/ai';
import { MdEmail, MdPhotoLibrary, MdNotificationsActive } from 'react-icons/md';
import { FaRandom, FaAddressCard } from 'react-icons/fa';
import { TbMessageCircle2 } from 'react-icons/tb';
import { IoMenu } from 'react-icons/io5';
import { BiLogOut } from 'react-icons/bi';
import { FaHandHoldingUsd } from 'react-icons/fa';

import ReactPullToRefresh from 'react-pull-to-refresh';
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';
import heart from 'react-useanimations/lib/heart';

import Modal from 'react-modal';
import data from '../data/posts';
import { FaUserAlt } from 'react-icons/fa';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { BsQuestionCircleFill } from "react-icons/bs";
import { HiHome } from 'react-icons/hi';
import { MdOutlineExpandMore } from "react-icons/md";
import toast, { LoaderIcon, Toaster } from 'react-hot-toast';

const notCompleted = () => toast('Saldo insuficiente para saque, complete a meta de R$ 2.000,00!');
const insufficient = () => toast('Você não pode solicitar saque de um valor maior do que possui na carteira!');
const missingData = () => toast('Dados insuficientes, insira sua chave pix para continuar!');
const dailyLimit = () => toast('Você alcançou o limite diário de R$30');
const termsAccepted = () => toast('Você aceitou os termos ✅!');


var wallet = require('../assets/wallet.png');
var logo = require('../assets/codluc.png');
var party = require('../assets/Party_Popper_Emojipedia.png');

var gno = require('../assets/gno.png');
var sinais = require('../assets/sinais.png');
var mines1 = require('../assets/mines1.png');
var mines2 = require('../assets/mines2.png');
var mines3 = require('../assets/mines3.png');
var mines4 = require('../assets/mines4.png');

function Bonus() {
    const navigate = useNavigate();
    const [money, setMoney] = useState(0);
    const [user, setUser] = useState({});
    const [mines, setMines] = useState()
    const [accordion, setAccordion] = useState(null)

    useEffect(() => {

        const images = [mines1, mines2, mines3, mines4];
        let currentIndex = 0;
            currentIndex = (currentIndex + 1) % images.length;
            setMines(images[currentIndex]);

        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            setMines(images[currentIndex]);
        }, 20000); // 10 seconds

        return () => {
            clearInterval(intervalId); // Clean up the interval on component unmount
        };
    }, []);

    const content=[
      {
        title: "Preciso pagar a taxa toda vez?",
        description: "Não! A taxa de segurança é paga somente a primeira vez, para confirmar que você é humano, e não um robô. Você receberá o estorno do valor da taxa, após o primeiro saque!"
      },
      {
        title: "Por que existe a taxa?",
        description: "É uma etapa de segurança, para evitar fraudes e abuso dos saques que estavam ocorrendo dentro da plataforma! Mas não precisa se preocupar, você receberá o valor da taxa de volta, junto ao valor do seu saque, é apenas uma etapa de confirmação de que você é humano e não um robô."
      },
      {
        title: "Em quanto tempo vou receber?",
        description: "Você receberá seu saque dentro de 24 horas, da mesma forma que você receber seu saque teste!"
      },
      {
        title: "Quantas vezes posso sacar por dia?",
        description: "Quantas você quiser, mas existe uma quantidade limitada de códigos que temos acesso por dia!"
      },
      {
        title: "Como usa o aplicativo?",
        description: "É muito simples de usar! Basta responder as simples perguntas sobre as empresas, no menu principal, e por fim, clicar no botão de 'Enviar respostas', quando enviar, já receberá seu dinheiro pela tarefa realizada!"
      },
    ]

    const accodionToggle = (index)=> {
      if ( accordion === index ) {
        setAccordion(null)
      } else {
        setAccordion(index)
        
      }
    }
    return (
        <>
            <div className="App">
              <div className="floatHeader">
                    <img src="https://whatspix.tech/cpapp/images/logonova_whats.png" alt="" />
              </div>
              <p className="info-questions">Perguntas frequentes</p>
              <div className="accordion-wrapper">
                  {
                    content.map((item, index) => (
                      <div className="first-info" key={index}>
                        
                        <header onClick={() => accodionToggle(index)} className="header-faq">{item.title}</header>
                        <p className={`description ${accordion === index ? 'opentab' : ''}`}>{item.description}</p>
                      </div>
                    ))
                  }
              </div>

              <div className="menu">
                <RiMoneyDollarCircleFill onClick={() => {navigate('/saque')}} size={45} style={{color: "rgb(101, 101, 101)"}}/>
                <HiHome size={45} onClick={() => {navigate('/')}} style={{color: "rgb(101, 101, 101)"}}/>
                <BsQuestionCircleFill className="active" size={45} />
              </div>
            </div>
            <Toaster />
        </>
    );
}

export default Bonus;