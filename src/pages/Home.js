import { useState, useEffect, useMemo } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";


import { Link, Navigate, useNavigate } from "react-router-dom";

import { getDoc, getDocs, doc, collection, DocumentReference, querySnapshot, onSnapshot, updateDoc, limit } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import uuid from 'react-uuid';




import Modal from 'react-modal';
import data from '../data/posts';

import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { BsQuestionCircleFill } from "react-icons/bs";
import { HiHome } from 'react-icons/hi';
import toast, { LoaderIcon, Toaster } from 'react-hot-toast';







function Home() {
    const navigate = useNavigate();
    const [money, setMoney] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [moneyToday, setMoneyToday] = useState(0);
    const [moneyFormated, setMoneyFormated] = useState('0');
    const [user, setUser] = useState({});
    const [limit, setLimit] = useState(10);
    const [cod, setCod] = useState(false);
    const [gerado, setGerado] = useState(false);
    const [codigo, setCodigo] = useState('');
    const [modalIsOpen, setModal] = useState(false);
    const [marca, setMarca] = useState('caixa');
    const [modalLimit, setModalLimit] = useState(false)
    const [lastSelectedBrand, setLastSelectedBrand] = useState(null);


    const postsData = data;
    let date = '';

    const customStyles = {
        content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '80%',
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

    const customStyles2 = {
        content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '10px 15px',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column'
        },
    };

    useEffect(() => {
        auth.onAuthStateChanged(function(authUser) {
            if (authUser) {
            setUser({user});
            } else {
            navigate('/login')
            }
        });
    }, []);

    useEffect(() => {
    const getMoney = async () => {
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }).split(",")[0];
        const likesCount = parseInt(localStorage.getItem(currentDate)) || 0;
       
        setLikeCount(likesCount);

        const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        setMoney(docSnap.data().money);

        if (!Number.isInteger(money)) {
        let formated = money.toString().replace('.', ',');
        setMoneyFormated(formated);
        } else {
        setMoneyFormated(money);
        }
    }
    getMoney();
    }, [money, user]);

    const updateMoney = async () => {
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }).split(",")[0];
        const likesCount = parseInt(localStorage.getItem(currentDate)) || 0;

        if (likesCount < limit) {
          
         
            const newClicks = likesCount + 1;
            localStorage.setItem(currentDate, newClicks);
            console.log(likesCount, limit)
            setLikeCount(newClicks);
            localStorage.setItem(`${currentDate}-timestamp`, new Date().getTime());

            const userMoney = doc(db, "users", auth.currentUser.uid);
            const total = money + 34;
            const newMoney = { money: total};
            const isNumber = typeof total;
            if (isNumber == 'number') {
              console.log(isNumber)
              await updateDoc(userMoney, newMoney);
            }
            
            const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
            setMoney(docSnap.data().money);
    
            if (localStorage.getItem(date)) {
                var totalToday = parseFloat(localStorage.getItem(date)) + 1;
            } else {
                var totalToday = 1;
            }
    
            setMoneyToday(totalToday);
            localStorage.setItem(date, totalToday);
    
            if (!Number.isInteger(money)) {
              let formated = money.toString().replace('.', ',');
              setMoneyFormated(formated);
            } else {
              setMoneyFormated(money);
            }
        } else {
            dailyLimit()
        }

      }

    const logout = async () => {
        await signOut(auth);
    };

    function closeModal() {
        setModal(false)
    }

    function dailyLimit() {
        setModalLimit(true)
    }
    var indiceAtual = parseInt(sessionStorage.getItem('indiceAtual')) ? parseInt(sessionStorage.getItem('indiceAtual'))  : 1;
//     const marcas = ['caixa', 'bancoDoBrasil', 'apple', 'amazon', 'ambev', 'mcDonalds', 'burgerKing', 'vivo', 'claro', 'tim'];

// const getRandomBrand = () => {
//   const marcas = ['caixa', 'bancoDoBrasil', 'apple', 'amazon', 'ambev', 'mcDonalds', 'burgerKing', 'vivo', 'claro', 'tim'];

//   // Inicialize a lista de marcas selecionadas
//   const marcasSelecionadas = [];

//   let brand;

//   for (let i = 0; i < marcas.length; i++) {
//     // Se a marca atual não estiver na lista, selecione-a
//     if (!marcasSelecionadas.includes(marcas[i])) {
//       brand = marcas[i];
//       break;
//     }
//   }

//   // Atualizar a lista de marcas selecionadas
//   marcasSelecionadas.push(brand);

//   return brand;
// };
//     const handleEnviarRespostas = () => {
//       setModal(true);
    
//       setTimeout(() => {
//         const marcaAleatoria = getRandomBrand();
//         setMarca(marcaAleatoria);
//         setModal(false);
//       }, 5000);
    
//       updateMoney();
//     };

  // CAIXA

  const [selectedNotaCaixa, setSelectedNotaCaixa] = useState(null);
  const [selectedPreferenceCaixa, setSelectedPreferenceCaixa] = useState(null);
  const [selectedLoanCaixa, setSelectedLoanCaixa] = useState(null);

  const handleNotaClickCaixa = (nota) => { setSelectedNotaCaixa(nota);};
  const handlePreferenceClickCaixa = (preference) => { setSelectedPreferenceCaixa(preference);};
  const handleLoanClickCaixa = (loan) => { setSelectedLoanCaixa(loan);};

  // BANCO DO BRASIL

  const [selectedNotaBCB, setSelectedNotaBCB] = useState(null);
  const [selectedPreferenceBCB, setSelectedPreferenceBCB] = useState(null);
  const [selectedLoanBCB, setSelectedLoanBCB] = useState(null);

  const handleNotaClickBCB = (nota) => { setSelectedNotaBCB(nota);};
  const handlePreferenceClickBCB = (preference) => { setSelectedPreferenceBCB(preference);};
  const handleLoanClickBCB = (loan) => { setSelectedLoanBCB(loan);};

  // APPLE

  const [selectedNotaAPPLE, setSelectedNotaAPPLE] = useState(null);
  const [selectedPreferenceAPPLE, setSelectedPreferenceAPPLE] = useState(null);
  const [selectedLoanAPPLE, setSelectedLoanAPPLE] = useState(null);

  const handleNotaClickAPPLE = (nota) => { setSelectedNotaAPPLE(nota);};
  const handlePreferenceClickAPPLE = (preference) => { setSelectedPreferenceAPPLE(preference);};
  const handleLoanClickAPPLE = (loan) => { setSelectedLoanAPPLE(loan);};

  // AMAZON

  const [selectedNotaAMAZON, setSelectedNotaAMAZON] = useState(null);
  const [selectedPreferenceAMAZON, setSelectedPreferenceAMAZON] = useState(null);
  const [selectedLoanAMAZON, setSelectedLoanAMAZON] = useState(null);

  const handleNotaClickAMAZON = (nota) => { setSelectedNotaAMAZON(nota);};
  const handlePreferenceClickAMAZON = (preference) => { setSelectedPreferenceAMAZON(preference);};
  const handleLoanClickAMAZON = (loan) => { setSelectedLoanAMAZON(loan);};

  // AMBEV

  const [selectedNotaAMBEV, setSelectedNotaAMBEV] = useState(null);
  const [selectedPreferenceAMBEV, setSelectedPreferenceAMBEV] = useState(null);
  const [selectedLoanAMBEV, setSelectedLoanAMBEV] = useState(null);

  const handleNotaClickAMBEV = (nota) => { setSelectedNotaAMBEV(nota);};
  const handlePreferenceClickAMBEV = (preference) => { setSelectedPreferenceAMBEV(preference);};
  const handleLoanClickAMBEV = (loan) => { setSelectedLoanAMBEV(loan);};

  // MCDO

  const [selectedNotaMCDO, setSelectedNotaMCDO] = useState(null);
  const [selectedPreferenceMCDO, setSelectedPreferenceMCDO] = useState(null);
  const [selectedLoanMCDO, setSelectedLoanMCDO] = useState(null);

  const handleNotaClickMCDO = (nota) => { setSelectedNotaMCDO(nota);};
  const handlePreferenceClickMCDO = (preference) => { setSelectedPreferenceMCDO(preference);};
  const handleLoanClickMCDO = (loan) => { setSelectedLoanMCDO(loan);};
  
  // BK

  const [selectedNotaBK, setSelectedNotaBK] = useState(null);
  const [selectedPreferenceBK, setSelectedPreferenceBK] = useState(null);
  const [selectedLoanBK, setSelectedLoanBK] = useState(null);

  const handleNotaClickBK = (nota) => { setSelectedNotaBK(nota);};
  const handlePreferenceClickBK = (preference) => { setSelectedPreferenceBK(preference);};
  const handleLoanClickBK = (loan) => { setSelectedLoanBK(loan);};

  // VIVO

  const [selectedNotaVIVO, setSelectedNotaVIVO] = useState(null);
  const [selectedPreferenceVIVO, setSelectedPreferenceVIVO] = useState(null);
  const [selectedLoanVIVO, setSelectedLoanVIVO] = useState(null);

  const handleNotaClickVIVO = (nota) => { setSelectedNotaVIVO(nota);};
  const handlePreferenceClickVIVO = (preference) => { setSelectedPreferenceVIVO(preference);};
  const handleLoanClickVIVO = (loan) => { setSelectedLoanVIVO(loan);};

  // CLARO

  const [selectedNotaCLARO, setSelectedNotaCLARO] = useState(null);
  const [selectedPreferenceCLARO, setSelectedPreferenceCLARO] = useState(null);
  const [selectedLoanCLARO, setSelectedLoanCLARO] = useState(null);

  const handleNotaClickCLARO = (nota) => { setSelectedNotaCLARO(nota);};
  const handlePreferenceClickCLARO = (preference) => { setSelectedPreferenceCLARO(preference);};
  const handleLoanClickCLARO = (loan) => { setSelectedLoanCLARO(loan);};

  // TIM

  const [selectedNotaTIM, setSelectedNotaTIM] = useState(null);
  const [selectedPreferenceTIM, setSelectedPreferenceTIM] = useState(null);
  const [selectedLoanTIM, setSelectedLoanTIM] = useState(null);

  const handleNotaClickTIM = (nota) => { setSelectedNotaTIM(nota);};
  const handlePreferenceClickTIM = (preference) => { setSelectedPreferenceTIM(preference);};
  const handleLoanClickTIM = (loan) => { setSelectedLoanTIM(loan);};
  


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
                        <img src="https://lordicon.com/icons/wired/flat/291-coin-dollar.gif" width={'45%'} style={{margin: 'auto'}} />
                        <p>Você recebeu:</p>
                        <p style={{fontSize: 50, color: "#28a745", margin: 0, fontWeight: "bold"}}>R$ 34,00</p>
                    </Modal>

                    <Modal
                        isOpen={modalLimit}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                        overlayClassName="modal-overlay"
                    >
                        
                        <div class="loader"></div>
                        <div style={{fontFamily: "Montserrat", margin: 15 }}>
                          <p style={{fontSize: 35, margin: 0, color: "#28a745" }}>R${money}.00</p>
                          <p style={{margin: 0, fontWeight: "normal"}}>Seu saldo subiu!</p>
                        </div>

                        <h2 style={{fontFamily: "Montserrat", color: "#28a745", fontSize: 32, margin: 0, fontWeight: "normal"}}>Parabéns!</h2>
                        <p style={{fontSize: 18, color: "#636363"}}>Você atingiu seu <br />
                          limite diário!
                        </p>
                        <button className="buttonGreen" onClick={() => {navigate('/saque')}}>SAQUE AGORA</button>
                    </Modal>
                    <div className="floatHeader">
                        <img src="https://whatspix.tech/cpapp/images/logonova_whats.png" width={220}/>
                        <button onClick={() => {navigate('/saque')}} className="buttonGreen" > <span className="selector">R$ {money}.00</span></button>
                    </div>
                
                    
                    <div className="loginCardWrapper card-cod">
                        <p style={{color:"#25D366", fontSize: 22, fontWeight: "bold"}}>Responda e ganhe R$34,00!</p>
                        {
                            marca == 'caixa' ?
                                <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "rgb(101, 101, 101)" }}>
                                  <div className="logo-card">
                                    <img style={{ width: '170px' }} src="https://whatspix.tech/cpapp/images/caixa.png" alt="" />
                                  </div>
                                  <p style={{ fontWeight: "bold" }}>De 1 a 5, que nota você dá para o atendimento da Caixa Econômica?</p>
                                  <div className="buttons-nota">
                                    <button className={selectedNotaCaixa === 1 ? 'selected' : ''} onClick={() => handleNotaClickCaixa(1)}>1 ☹️</button>
                                    <button className={selectedNotaCaixa === 2 ? 'selected' : ''} onClick={() => handleNotaClickCaixa(2)}>2 😕</button>
                                    <button className={selectedNotaCaixa === 3 ? 'selected' : ''} onClick={() => handleNotaClickCaixa(3)}>3 😐</button>
                                    <button className={selectedNotaCaixa === 4 ? 'selected' : ''} onClick={() => handleNotaClickCaixa(4)}>4 😀</button>
                                    <button className={selectedNotaCaixa === 5 ? 'selected' : ''} onClick={() => handleNotaClickCaixa(5)}>5 😍</button>
                                  </div>
                                  <p style={{ fontWeight: "bold" }}>Em um banco, você prefere um cartão com limite maior ou menores taxas?</p>
                                  <div className="buttons">
                                    <button className={selectedPreferenceCaixa === 'Limite maior' ? 'selected' : ''} onClick={() => handlePreferenceClickCaixa('Limite maior')}>Limite maior</button>
                                    <button className={selectedPreferenceCaixa === 'Menores taxas' ? 'selected' : ''} onClick={() => handlePreferenceClickCaixa('Menores taxas')}>Menores taxas</button>
                                  </div>
                                  <p style={{ fontWeight: "bold" }}>Você faria um empréstimo nesse banco atualmente?</p>
                                  <div className="buttons">
                                    <button className={selectedLoanCaixa === 'Sim' ? 'selected' : ''} onClick={() => handleLoanClickCaixa('Sim')}>Sim 👍</button>
                                    <button className={selectedLoanCaixa === 'Não' ? 'selected' : ''} onClick={() => handleLoanClickCaixa('Não')}>Não 👎</button>
                                  </div>
                                </div>


                            // BANCO DO BRASIL
                            
                            : marca == 'bancoDoBrasil' ?
                              <div style={{width: "100%", display: "flex",flexDirection: "column" , justifyContent: "center", alignItems: "center", color: "rgb(101, 101, 101)"}}>
                                <div className="logo-card">
                                  <img style={{width: '170px', borderRadius: 15}} src="https://whatspix.tech/cpapp/images/bancobrasil.png" alt="" />
                                </div>
                                <p style={{fontWeight: "bold"}}>De 1 a 5, que nota você dá para o atendimento do Banco do Brasil?</p>
                                <div className="buttons-nota">
                                    <button className={selectedNotaBCB === 1 ? 'selected' : ''} onClick={() => handleNotaClickBCB(1)}>1 ☹️</button>
                                    <button className={selectedNotaBCB === 2 ? 'selected' : ''} onClick={() => handleNotaClickBCB(2)}>2 😕</button>
                                    <button className={selectedNotaBCB === 3 ? 'selected' : ''} onClick={() => handleNotaClickBCB(3)}>3 😐</button>
                                    <button className={selectedNotaBCB === 4 ? 'selected' : ''} onClick={() => handleNotaClickBCB(4)}>4 😀</button>
                                    <button className={selectedNotaBCB === 5 ? 'selected' : ''} onClick={() => handleNotaClickBCB(5)}>5 😍</button>
                                </div>
                                <p style={{fontWeight: "bold"}}>Em um banco, você prefere um cartão com limite maior ou menores taxas?</p>
                                <div className="buttons">
                                    <button className={selectedPreferenceBCB === 'Limite maior' ? 'selected' : ''} onClick={() => handlePreferenceClickBCB('Limite maior')}>Limite maior</button>
                                    <button className={selectedPreferenceBCB === 'Menores taxas' ? 'selected' : ''} onClick={() => handlePreferenceClickBCB('Menores taxas')}>Menores taxas</button>
                                </div>
                                <p style={{fontWeight: "bold"}}>Você faria um empréstimo nesse banco atualmente?</p>
                                <div className="buttons">
                                    <button className={selectedLoanBCB === 'Sim' ? 'selected' : ''} onClick={() => handleLoanClickBCB('Sim')}>Sim 👍</button>
                                    <button className={selectedLoanBCB === 'Não' ? 'selected' : ''} onClick={() => handleLoanClickBCB('Não')}>Não 👎</button>
                                </div>
                              </div>
                              
                              // APPLE

                             : marca == 'apple' ?
                              <div style={{width: "100%", display: "flex",flexDirection: "column" , justifyContent: "center", alignItems: "center", color: "rgb(101, 101, 101)"}}>
                                <div className="logo-card">
                                  <img style={{width: '85px', borderRadius: 15}} src="https://whatspix.tech/cpapp/images/apple.png" alt="" />
                                </div>
                                <p style={{fontWeight: "bold"}}>De 1 a 5, que nota você dá para a Apple?</p>
                                <div className="buttons-nota">
                                    <button className={selectedNotaAPPLE === 1 ? 'selected' : ''} onClick={() => handleNotaClickAPPLE(1)}>1 ☹️</button>
                                    <button className={selectedNotaAPPLE === 2 ? 'selected' : ''} onClick={() => handleNotaClickAPPLE(2)}>2 😕</button>
                                    <button className={selectedNotaAPPLE === 3 ? 'selected' : ''} onClick={() => handleNotaClickAPPLE(3)}>3 😐</button>
                                    <button className={selectedNotaAPPLE === 4 ? 'selected' : ''} onClick={() => handleNotaClickAPPLE(4)}>4 😀</button>
                                    <button className={selectedNotaAPPLE === 5 ? 'selected' : ''} onClick={() => handleNotaClickAPPLE(5)}>5 😍</button>
                                </div>
                                <p style={{fontWeight: "bold"}}>Em uma loja de Eletrônicos, você prefere mais Celular ou Tablet?</p>
                                <div className="buttons">
                                      <button className={selectedPreferenceAPPLE === 'Limite maior' ? 'selected' : ''} onClick={() => handlePreferenceClickAPPLE('Limite maior')}>Celular</button>
                                      <button className={selectedPreferenceAPPLE === 'Menores taxas' ? 'selected' : ''} onClick={() => handlePreferenceClickAPPLE('Menores taxas')}>Tablet</button>
                                </div>
                                <p style={{fontWeight: "bold"}}>Com base na sua experiência geral, você recomendaria a Apple a amigos e familiares?</p>
                                <div className="buttons">
                                      <button className={selectedLoanAPPLE === 'Sim' ? 'selected' : ''} onClick={() => handleLoanClickAPPLE('Sim')}>Sim 👍</button>
                                      <button className={selectedLoanAPPLE === 'Não' ? 'selected' : ''} onClick={() => handleLoanClickAPPLE('Não')}>Não 👎</button>
                                </div>
                              </div>

                            // AMAZON

                            :  marca == 'amazon' ?
                            <div style={{width: "100%", display: "flex",flexDirection: "column" , justifyContent: "center", alignItems: "center", color: "rgb(101, 101, 101)"}}>
                              <div className="logo-card">
                                <img style={{width: '200px', borderRadius: 15}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/603px-Amazon_logo.svg.png" alt="" />
                              </div>
                              <p style={{fontWeight: "bold"}}>De 1 a 5, que nota você dá para o grupo Amazon?</p>
                              <div className="buttons-nota">
                                  <button className={selectedNotaAMAZON === 1 ? 'selected' : ''} onClick={() => handleNotaClickAMAZON(1)}>1 ☹️</button>
                                  <button className={selectedNotaAMAZON === 2 ? 'selected' : ''} onClick={() => handleNotaClickAMAZON(2)}>2 😕</button>
                                  <button className={selectedNotaAMAZON === 3 ? 'selected' : ''} onClick={() => handleNotaClickAMAZON(3)}>3 😐</button>
                                  <button className={selectedNotaAMAZON === 4 ? 'selected' : ''} onClick={() => handleNotaClickAMAZON(4)}>4 😀</button>
                                  <button className={selectedNotaAMAZON === 5 ? 'selected' : ''} onClick={() => handleNotaClickAMAZON(5)}>5 😍</button>
                              </div>
                              <p style={{fontWeight: "bold"}}>Você prefere comprar produtos pela internet ou loja fisica?</p>
                              <div className="buttons">
                                    <button className={selectedPreferenceAMAZON === 'Limite maior' ? 'selected' : ''} onClick={() => handlePreferenceClickAMAZON('Limite maior')}>Internet</button>
                                    <button className={selectedPreferenceAMAZON === 'Menores taxas' ? 'selected' : ''} onClick={() => handlePreferenceClickAMAZON('Menores taxas')}>Pessoalmente</button>
                              </div>
                              <p style={{fontWeight: "bold"}}>Você já chegou a usar algum dos serviços da Amazon?</p>
                              <div className="buttons">
                                    <button className={selectedLoanAMAZON === 'Sim' ? 'selected' : ''} onClick={() => handleLoanClickAMAZON('Sim')}>Sim 👍</button>
                                    <button className={selectedLoanAMAZON === 'Não' ? 'selected' : ''} onClick={() => handleLoanClickAMAZON('Não')}>Não 👎</button>
                              </div>
                            </div>

                            // AMBEV

                            : marca == 'ambev' ?
                              <div style={{width: "100%", display: "flex",flexDirection: "column" , justifyContent: "center", alignItems: "center", color: "rgb(101, 101, 101)"}}>
                                <div className="logo-card">
                                  <img style={{width: '200px', borderRadius: 15}} src="https://logodownload.org/wp-content/uploads/2017/09/ambev-logo.png" alt="" />
                                </div>
                                <p style={{fontWeight: "bold"}}>De 1 a 5, que nota você dá para o grupo Ambev?</p>
                                <div className="buttons-nota">
                                  <button className={selectedNotaAMBEV === 1 ? 'selected' : ''} onClick={() => handleNotaClickAMBEV(1)}>1 ☹️</button>
                                  <button className={selectedNotaAMBEV === 2 ? 'selected' : ''} onClick={() => handleNotaClickAMBEV(2)}>2 😕</button>
                                  <button className={selectedNotaAMBEV === 3 ? 'selected' : ''} onClick={() => handleNotaClickAMBEV(3)}>3 😐</button>
                                  <button className={selectedNotaAMBEV === 4 ? 'selected' : ''} onClick={() => handleNotaClickAMBEV(4)}>4 😀</button>
                                  <button className={selectedNotaAMBEV === 5 ? 'selected' : ''} onClick={() => handleNotaClickAMBEV(5)}>5 😍</button>
                                </div>
                                <p style={{fontWeight: "bold"}}>Você prefere comprar bebidas com alcool ou sem alcool?</p>
                                <div className="buttons">
                                    <button className={selectedPreferenceAMBEV === 'Limite maior' ? 'selected' : ''} onClick={() => handlePreferenceClickAMBEV('Limite maior')}>Com</button>
                                    <button className={selectedPreferenceAMBEV === 'Menores taxas' ? 'selected' : ''} onClick={() => handlePreferenceClickAMBEV('Menores taxas')}>Sem</button>
                                </div>
                                <p style={{fontWeight: "bold"}}>Você já chegou a consumir algum dos produtos do grupo Ambev?</p>
                                <div className="buttons">
                                    <button className={selectedLoanAMBEV === 'Sim' ? 'selected' : ''} onClick={() => handleLoanClickAMBEV('Sim')}>Sim 👍</button>
                                    <button className={selectedLoanAMBEV === 'Não' ? 'selected' : ''} onClick={() => handleLoanClickAMBEV('Não')}>Não 👎</button>
                                </div>
                              </div>

                              // MCDONALDS

                            : marca == 'mcDonalds' ?
                              <div style={{width: "100%", display: "flex",flexDirection: "column" , justifyContent: "center", alignItems: "center", color: "rgb(101, 101, 101)"}}>
                                <div className="logo-card">
                                  <img style={{width: '200px', borderRadius: 15}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/2339px-McDonald%27s_Golden_Arches.svg.png" alt="" />
                                </div>
                                <p style={{fontWeight: "bold"}}>De 1 a 5, que nota você dá para o McDonald's?</p>
                                <div className="buttons-nota">
                                  <button className={selectedNotaMCDO === 1 ? 'selected' : ''} onClick={() => handleNotaClickMCDO(1)}>1 ☹️</button>
                                  <button className={selectedNotaMCDO === 2 ? 'selected' : ''} onClick={() => handleNotaClickMCDO(2)}>2 😕</button>
                                  <button className={selectedNotaMCDO === 3 ? 'selected' : ''} onClick={() => handleNotaClickMCDO(3)}>3 😐</button>
                                  <button className={selectedNotaMCDO === 4 ? 'selected' : ''} onClick={() => handleNotaClickMCDO(4)}>4 😀</button>
                                  <button className={selectedNotaMCDO === 5 ? 'selected' : ''} onClick={() => handleNotaClickMCDO(5)}>5 😍</button>
                                </div>
                                <p style={{fontWeight: "bold"}}>Você já comprou algum lanche no McDonald's</p>
                                <div className="buttons">
                                <button className={selectedPreferenceMCDO === 'Limite maior' ? 'selected' : ''} onClick={() => handlePreferenceClickMCDO('Limite maior')}>Sim</button>
                                    <button className={selectedPreferenceMCDO === 'Menores taxas' ? 'selected' : ''} onClick={() => handlePreferenceClickMCDO('Menores taxas')}>Não</button>
                                </div>
                                <p style={{fontWeight: "bold"}}>Você recomendaria para algum amigo ou familiar o McDonald's</p>
                                <div className="buttons">
                                    <button className={selectedLoanMCDO === 'Sim' ? 'selected' : ''} onClick={() => handleLoanClickMCDO('Sim')}>Sim 👍</button>
                                    <button className={selectedLoanMCDO === 'Não' ? 'selected' : ''} onClick={() => handleLoanClickMCDO('Não')}>Não 👎</button>
                                </div>
                              </div>

                              // Burguer

                              : marca == 'burgerKing' ?
                                <div style={{width: "100%", display: "flex",flexDirection: "column" , justifyContent: "center", alignItems: "center", color: "rgb(101, 101, 101)"}}>
                                  <div className="logo-card">
                                    <img style={{width: '200px', borderRadius: 15}} src="https://gkpb.com.br/wp-content/uploads/2021/01/novo-logo-burger-king.jpg" alt="" />
                                  </div>
                                  <p style={{fontWeight: "bold"}}>De 1 a 5, que nota você dá para o Burguer King?</p>
                                  <div className="buttons-nota">
                                  <button className={selectedNotaBK === 1 ? 'selected' : ''} onClick={() => handleNotaClickBK(1)}>1 ☹️</button>
                                    <button className={selectedNotaBK === 2 ? 'selected' : ''} onClick={() => handleNotaClickBK(2)}>2 😕</button>
                                    <button className={selectedNotaBK === 3 ? 'selected' : ''} onClick={() => handleNotaClickBK(3)}>3 😐</button>
                                    <button className={selectedNotaBK === 4 ? 'selected' : ''} onClick={() => handleNotaClickBK(4)}>4 😀</button>
                                    <button className={selectedNotaBK === 5 ? 'selected' : ''} onClick={() => handleNotaClickBK(5)}>5 😍</button>
                                  </div>
                                  <p style={{fontWeight: "bold"}}>Você já comprou algum lanche no Burguer King?</p>
                                  <div className="buttons">
                                    <button className={selectedPreferenceBK === 'Limite maior' ? 'selected' : ''} onClick={() => handlePreferenceClickBK('Limite maior')}>Sim</button>
                                    <button className={selectedPreferenceBK === 'Menores taxas' ? 'selected' : ''} onClick={() => handlePreferenceClickBK('Menores taxas')}>Não</button>
                                  </div>
                                  <p style={{fontWeight: "bold"}}>Você recomendaria para algum amigo ou familiar o Burguer King?</p>
                                  <div className="buttons">
                                  <button className={selectedLoanBK === 'Sim' ? 'selected' : ''} onClick={() => handleLoanClickBK('Sim')}>Sim 👍</button>
                                      <button className={selectedLoanBK === 'Não' ? 'selected' : ''} onClick={() => handleLoanClickBK('Não')}>Não 👎</button>
                                  </div>
                                </div>

                                // VIVO

                              : marca == 'vivo' ?
                                <div style={{width: "100%", display: "flex",flexDirection: "column" , justifyContent: "center", alignItems: "center", color: "rgb(101, 101, 101)"}}>
                                    <div className="logo-card">
                                      <img style={{width: '200px', borderRadius: 15}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWu6rlDaErJUwA_k51D_GXrQbZefoHoYbyK88HVqfcWw&s" alt="" />
                                    </div>
                                    <p style={{fontWeight: "bold"}}>De 1 a 5, que nota você dá para a Vivo?</p>
                                    <div className="buttons-nota">
                                      <button className={selectedNotaVIVO === 1 ? 'selected' : ''} onClick={() => handleNotaClickVIVO(1)}>1 ☹️</button>
                                      <button className={selectedNotaVIVO === 2 ? 'selected' : ''} onClick={() => handleNotaClickVIVO(2)}>2 😕</button>
                                      <button className={selectedNotaVIVO === 3 ? 'selected' : ''} onClick={() => handleNotaClickVIVO(3)}>3 😐</button>
                                      <button className={selectedNotaVIVO === 4 ? 'selected' : ''} onClick={() => handleNotaClickVIVO(4)}>4 😀</button>
                                      <button className={selectedNotaVIVO === 5 ? 'selected' : ''} onClick={() => handleNotaClickVIVO(5)}>5 😍</button>
                                    </div>
                                    <p style={{fontWeight: "bold"}}>Você já comprou algum produto da Vivo?</p>
                                    <div className="buttons">
                                    <button className={selectedPreferenceVIVO === 'Limite maior' ? 'selected' : ''} onClick={() => handlePreferenceClickVIVO('Limite maior')}>Sim</button>
                                    <button className={selectedPreferenceVIVO === 'Menores taxas' ? 'selected' : ''} onClick={() => handlePreferenceClickVIVO('Menores taxas')}>Não</button>
                                    </div>
                                    <p style={{fontWeight: "bold"}}>Você recomendaria para algum amigo ou familiar a Vivo?</p>
                                    <div className="buttons">
                                      <button className={selectedLoanVIVO === 'Sim' ? 'selected' : ''} onClick={() => handleLoanClickVIVO('Sim')}>Sim 👍</button>
                                      <button className={selectedLoanVIVO === 'Não' ? 'selected' : ''} onClick={() => handleLoanClickVIVO('Não')}>Não 👎</button>
                                    </div>
                                </div> 

                                // CLARO

                              : marca == 'claro'?
                                <div style={{width: "100%", display: "flex",flexDirection: "column" , justifyContent: "center", alignItems: "center", color: "rgb(101, 101, 101)"}}>
                                  <div className="logo-card">
                                    <img style={{width: '200px', borderRadius: 15}} src="https://logodownload.org/wp-content/uploads/2014/02/claro-logo-8.png" alt="" />
                                  </div>
                                  <p style={{fontWeight: "bold"}}>De 1 a 5, que nota você dá para a Claro?</p>
                                  <div className="buttons-nota">
                                      <button className={selectedNotaCLARO === 1 ? 'selected' : ''} onClick={() => handleNotaClickCLARO(1)}>1 ☹️</button>
                                      <button className={selectedNotaCLARO === 2 ? 'selected' : ''} onClick={() => handleNotaClickCLARO(2)}>2 😕</button>
                                      <button className={selectedNotaCLARO === 3 ? 'selected' : ''} onClick={() => handleNotaClickCLARO(3)}>3 😐</button>
                                      <button className={selectedNotaCLARO === 4 ? 'selected' : ''} onClick={() => handleNotaClickCLARO(4)}>4 😀</button>
                                      <button className={selectedNotaCLARO === 5 ? 'selected' : ''} onClick={() => handleNotaClickCLARO(5)}>5 😍</button>
                                  </div>
                                  <p style={{fontWeight: "bold"}}>Você já comprou algum produto da Claro?</p>
                                  <div className="buttons">
                                    <button className={selectedPreferenceCLARO === 'Limite maior' ? 'selected' : ''} onClick={() => handlePreferenceClickCLARO('Limite maior')}>Sim</button>
                                    <button className={selectedPreferenceCLARO === 'Menores taxas' ? 'selected' : ''} onClick={() => handlePreferenceClickCLARO('Menores taxas')}>Não</button>
                                  </div>
                                  <p style={{fontWeight: "bold"}}>Você recomendaria para algum amigo ou familiar a Claro?</p>
                                  <div className="buttons">
                                      <button className={selectedLoanCLARO === 'Sim' ? 'selected' : ''} onClick={() => handleLoanClickCLARO('Sim')}>Sim 👍</button>
                                      <button className={selectedLoanCLARO === 'Não' ? 'selected' : ''} onClick={() => handleLoanClickCLARO('Não')}>Não 👎</button>
                                  </div>
                                </div> 

                                // TIM

                              : marca == 'tim'?
                                <div style={{width: "100%", display: "flex",flexDirection: "column" , justifyContent: "center", alignItems: "center", color: "rgb(101, 101, 101)"}}>
                                  <div className="logo-card">
                                    <img style={{width: '200px', borderRadius: 15}} src="https://assets.stickpng.com/images/62c84079ed69915071b3e726.png" alt="" />
                                  </div>
                                  <p style={{fontWeight: "bold"}}>De 1 a 5, que nota você dá para a Tim?</p>
                                  <div className="buttons-nota">
                                      <button className={selectedNotaTIM === 1 ? 'selected' : ''} onClick={() => handleNotaClickTIM(1)}>1 ☹️</button>
                                      <button className={selectedNotaTIM === 2 ? 'selected' : ''} onClick={() => handleNotaClickTIM(2)}>2 😕</button>
                                      <button className={selectedNotaTIM === 3 ? 'selected' : ''} onClick={() => handleNotaClickTIM(3)}>3 😐</button>
                                      <button className={selectedNotaTIM === 4 ? 'selected' : ''} onClick={() => handleNotaClickTIM(4)}>4 😀</button>
                                      <button className={selectedNotaTIM === 5 ? 'selected' : ''} onClick={() => handleNotaClickTIM(5)}>5 😍</button>
                                  </div>
                                  <p style={{fontWeight: "bold"}}>Você já comprou algum produto da Tim?</p>
                                  <div className="buttons">
                                    <button className={selectedPreferenceTIM === 'Limite maior' ? 'selected' : ''} onClick={() => handlePreferenceClickTIM('Limite maior')}>Sim</button>
                                    <button className={selectedPreferenceTIM === 'Menores taxas' ? 'selected' : ''} onClick={() => handlePreferenceClickTIM('Menores taxas')}>Não</button>
                                  </div>
                                  <p style={{fontWeight: "bold"}}>Você recomendaria para algum amigo ou familiar a Tim?</p>
                                <div className="buttons">
                                      <button className={selectedLoanTIM === 'Sim' ? 'selected' : ''} onClick={() => handleLoanClickTIM('Sim')}>Sim 👍</button>
                                      <button className={selectedLoanTIM === 'Não' ? 'selected' : ''} onClick={() => handleLoanClickTIM('Não')}>Não 👎</button>
                                  </div>
                                </div> 
                             : null  
                         } 
  
                        <button className="buttonEnviar" onClick={() => {
                            setModal(true);
                            setTimeout(() => {
                                
                                const marcas = ['caixa', 'bancoDoBrasil', 'apple', 'amazon', 'ambev', 'mcDonalds', 'burgerKing', 'vivo', 'claro', 'tim'];
                                const indiceAleatorio = Math.floor(Math.random() * marcas.length);
                                const marcaAleatoria = marcas[indiceAleatorio];

                                const marcaAtual = marcas[indiceAtual];
                                if (indiceAtual == 9) {
                                  sessionStorage.setItem('indiceAtual', 1)
                                } else {
                                  sessionStorage.setItem('indiceAtual', (indiceAtual + 1))

                                }

                                setMarca(marcaAtual);
                                console.log(marcaAtual, indiceAtual)
                          
                        
                                setModal(false);
                            }, 5000);
                            updateMoney()
                        }}>Enviar respostas</button>
                    </div>
                    
                    
                
                <div className="menu">
                <RiMoneyDollarCircleFill onClick={() => {navigate('/saque')}} size={45} style={{color: "rgb(101, 101, 101)"}} />
                <HiHome className="active" size={45} />
                <BsQuestionCircleFill  onClick={() => {navigate('/bonus')}} size={45} style={{color: "rgb(101, 101, 101)"}}/>

                </div>
            </div>
            <Toaster />
        </>
    );
}

export default Home;