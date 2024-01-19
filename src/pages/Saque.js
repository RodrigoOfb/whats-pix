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
import toast, { LoaderIcon, Toaster } from 'react-hot-toast';

const notCompleted = () => toast('Saldo insuficiente para saque, complete a meta de R$ 2.000,00!');
const insufficient = () => toast('Você não pode solicitar saque de um valor maior do que possui na carteira!');
const missingData = () => toast('Dados insuficientes, insira sua chave pix para continuar!');
const dailyLimit = () => toast('Você alcançou o limite diário de R$30');
const termsAccepted = () => toast('Você aceitou os termos ✅!');


var wallet = require('../assets/wallet.png');
var logo = require('../assets/codluc.png');
var coins = require('../assets/pngtree-flying-gold-coin-png-png-image_6046123.png');

var gno = require('../assets/gno.png');
var cpf = require('../assets/cpf.png');
var email = require('../assets/email.png');
var qr = require('../assets/qr.png');
var telefone = require('../assets/telefone.png');

function Saque() {
    const navigate = useNavigate();
    const [money, setMoney] = useState(0);
    const [user, setUser] = useState({});
    const [mines, setMines] = useState();
    const [clickedDiv, setClickedDiv] = useState(null);
    const [modalIsOpen, setModal] = useState(false);


    const customStyles = {
        content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '85%',
        height: '350px',
        borderRadius: '15px',
        borderWidth: '1px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '40px 15px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column'
        },
    };  

    const handleDivClick = (index) => {
      setClickedDiv(index);
    };

    useEffect(() => {
        const getMoney = async () => {
            const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
            setMoney(docSnap.data().money);

        }
        getMoney();
        }, [money, user]);

        function closeModal() {
            setModal(false)
        }

    return (
        <>
            <div className="App">
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    overlayClassName="modal-overlay"
                    className= "modal"
                >
                  
                    <img style={{width: 100}} src="https://cdn.pixabay.com/animation/2023/06/13/15/12/15-12-30-710_512.gif" alt="" />
                    <h3 style={{fontSize: 20, fontWeight: 'bold', margin: 0, marginBottom: 10, color: "#333"}}>DESBLOQUEAR SEU SALDO</h3>
                    <p>Usamos uma taxa de segurança, para evitar fraudes e abuso dos saques que estavam ocorrendo dentro do sistema.</p>
                    <p>Fique tranquilo, você receberá o valor da taxa de volta junto ao valor do seu saque, é apenas uma etapa de confirmação de que você é humano e não um robô.</p>
                    <button className="buttonGreen" onClick={() => {window.open('https://go.perfectpay.com.br/PPU38CNS4NM')}}>DESBLOQUEAR SALDO</button>
                    

                </Modal>
                <div className="floatHeader">
                    <img src="https://whatspix.tech/cpapp/images/logonova_whats.png"/>
                </div>

                <div className="wrapperContainer">
                    <div className="card-white">
                        <span>Seu saldo</span>
                        <h1>R$ {money}.00</h1>
                    </div>
                    <p style={{color: "rgb(101, 101, 101)", fontWeight: "bold"}}>Selecione seu tipo de chave PIX</p>
                    <div className="card-pix">
                        <div className={`pix ${clickedDiv === 0 ? 'clicked' : ''}`} onClick={() => handleDivClick(0)}>
                            <img src={cpf} />
                        </div>

                        <div className={`pix ${clickedDiv === 1 ? 'clicked' : ''}`} onClick={() => handleDivClick(1)}>
                            <img src={telefone} />
                        </div>
                        
                        <div className={`pix ${clickedDiv === 2 ? 'clicked' : ''}`} onClick={() => handleDivClick(2)}>
                            <img src={email} />
                        </div>


                        <div className={`pix ${clickedDiv === 3 ? 'clicked' : ''}`} onClick={() => handleDivClick(3)}>
                            <img src={qr} />
                        </div>
                    </div>

                    <input type="text" placeholder="Digite sua chave PIX aqui" />
                    <input type="number" placeholder="Digite aqui quanto deseja sacar" />
                    <button className="buttonGreen" onClick={() => {
                        setModal(true);
                    }}>REALIZAR SAQUE</button>

                </div>

                <div className="menu">
                <RiMoneyDollarCircleFill className="active" size={45} />
                <HiHome size={45} onClick={() => {navigate('/')}} style={{color: "rgb(101, 101, 101)"}}/>
                <BsQuestionCircleFill  onClick={() => {navigate('/bonus')}} size={45} style={{color: "rgb(101, 101, 101)"}}/>
                </div>
            </div>
            <Toaster />
        </>
    );
}

export default Saque;