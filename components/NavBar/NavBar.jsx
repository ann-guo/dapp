import React, {useState, useContext} from 'react'
import Image from 'next/image'
import Link from 'next/link';
import {AiFillLock, AiFillUnock} from "react-icons/ai";

import {VotingContext} from '../../context/Voter'
import Style from './NavBar.module.css';
import loading from '../../assets/loading.gif';


const NavBar = () => {
  const {connectWallet, error, currentAccount} = useContext(VotingContext)

  const [openNav, setOpenNav] = useState(true);
  const openNavigation = () => {
    if(openNav) {
      setOpenNav(false)
    }else if(!openNav) {
      setOpenNav(true)
    }
  }

  return (
    <div clasName={Style.navbar}>
      {error ==="" ? (
          ""
      ) : (
        <div className={Style.message__box}>
          <div className={Style.message}>
            <p>{error}</p>
          </div>
        </div>
      )}
      <div className={Style.navbar_box}> 
        <div className={Style.title}>
          <Link to={{ pathname: '/' }}>
            <Image src={loading} alt="logo" width={80} height={80}/>
          </Link>
        </div>

        <div className={Style.connect}>
          {currentAccount ? (
            <div>
              <div className={Style.connect_flex}>
                <button onClick={()=> openNavigation()}>
                  {currentAccount.slice(0,10)}..
                </button>
                {currentAccount && (
                  <span>{openNav ? (
                    <AiFillUnock onClick={()=> openNavigation()}/>
                   ) : (
                    <AiFillLock onClick={()=> openNavigation()}/>
                   )} </span>
                )}
              </div>

              {openNav && (
                <div className={Style.navigation}>
                  <p>
                    <Link to={{ppathname: "/"}}> Home</Link>
                  </p>
                  <p>
                    <Link to={{ppathname: "/candidateRegistration"}}> Candidate Registration</Link>
                  </p>
                  <p>
                    <Link to={{ppathname: "/allowedVoters"}}> Voter Registration</Link>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => connectWallet()}> Connect Wallet</button>          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar