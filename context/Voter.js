import React, { useState, useEffect } from 'react'
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import {create as ipfsHttpClient } from "ipfs-http-client";
//import axios from "axios";
import { useRouter } from "next/router";

import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

import { VotingAddress, VotingAddressABI } from "./constants";
const projectId = "2U2GSwsuX6C8bSngIMRNOGkjwJO";
const projectSecretKey="270b098b4c9f46a26e7759067ba869e6";
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecretKey).toString('base64')


const client = ipfsHttpClient({ 
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
    headers: { 
        authorization: auth
    }
})
    





const fetchContract = (signerOrProvider) => new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({children}) => {
    const votingTitle = 'My first smart contract app'
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateLength, setCandidateLength] = useState('');
    const pushCandidate = [];
    const candidateIndex = [];
    const [candidateArray, setCandidateArray] = useState(pushCandidate);
    /////////////
    const [web3Provider, setWeb3Provider] = useState(null);

    //End of candidate DATA

    const [error, setError] = useState('');
    const highestVote = [];

    //VOTER SECTION
    const pushVoter = [];
    const [voterArray, setVoterArray] = useState(pushVoter);
    const [voterLength, setVoterLength] = useState('');
    const [voterAddress, setVoterAddress] = useState([]); //1:03
    

    //CONNECTING METAMASK
    const checkIFWalletIsConnected = async() => {
        try {
            if (window.ethereum) {
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
              const account = accounts[0];
              setCurrentAccount(account)
              console.log("Account Connected: ", account);
            } else {
              console.log("No Metamask detected");
            }
          } catch (error) {
            console.log(error);
          }
      
    }

    //CONNECT WALLET
    const connectWallet = async() => {
        if (!window.ethereum) return setError("Please install MetaMask")
        const account = await window.ethereum.request({method:"eth_requestAccounts",});
        setCurrentAccount(account[0])
    }
    

    //UPLOAD TO IPFS VOTER IMAGE
    const uploadToIPFS = async(file) => {
       
        try {
            
            const added = await client.add(file)
            const url = `https://voting01.infura-ipfs.io/ipfs/${added.path}`
            console.log(`Url --> ${url}`)
            return url;
        } catch (error) {
            setError("Error Uploading file to IPFS");
        }
    }

    const uploadToIPFSCandidate= async(file) => {
       
        try {
            
            const added = await client.add(file)
            const url = `https://voting01.infura-ipfs.io/ipfs/${added.path}`
            console.log(`Url --> ${url}`)
            return url;
        } catch (error) {
            setError("Error Uploading file to IPFS");
        }
    }
    
    const ABI = [
        "function voterRight(address _address, string memory _name, string memory _image, string memory _ipfs) public",
        "function getVoterList() public view returns (address[] memory)",
        "function getVoterdata (address _address) public view returns (uint256, string memory, string memory, address, string memory, uint256, bool)",
        "function getCandidatedata(address _address) public view returns (string memory, string memory, uint256, string memory, uint256, string memory, address)",
        "function getCandidate() public view returns (address[] memory)",
        "function getCandidateLength() public view returns (uint256)",
        "function setCandidate(address _address, string memory _age, string memory _name, string memory _image, string memory _ipfs) public",
        

        ]

    //1:57 Create voter
    const createVoter = async(formInput, fileUrl, router)=> {
        try{
            
            const {name, address, position} = formInput;
            
            
            if(!name || !address || !position ||!fileUrl )  {
                return console.log("Input data is missing");
            }
            //CONNECTING SMART CONTRACT 2
            if(window.ethereum){
                const provider = new ethers.BrowserProvider(window.ethereum);
                //console.log("provider", provider)
                //console.log("Selected Address:", provider.provider.selectedAddress);
                if(provider) {
                    
                    setWeb3Provider(provider);
                }
                const signer = await provider.getSigner();
              
                const contract = new ethers.Contract(VotingAddress, ABI, signer)
                
                
                const data = JSON.stringify({name, address, position,image: fileUrl})
                const added = await client.add(data)
                const url = `https://voting01.infura-ipfs.io/ipfs/${added.path}`
                //console.log(`IPFS --> ${url}`)
             
                
                const voter = await contract.voterRight(address,name,url, fileUrl);
                
                await voter.wait(); 
                //getAllVoterData(); 

                console.log("VOTER",voter)
                console.log("Transaction Hash:", voter.hash);
                getVoterList()
                
                //router.push("/voterList") 

            }
            
           

        } catch(error) {
            setError("Error in creating voter")
        }
    }
    

     const getAllVoterData = async() => {
        //console.log('testing')
        try{
            if(window.ethereum){
                //console.log('testing')
                const provider = new ethers.BrowserProvider(window.ethereum);
               // const signer = await provider.getSigner();
                const contract = new ethers.Contract(VotingAddress,ABI, provider);
                const voterList = await contract.getVoterList()
                
                
                setVoterAddress(voterList);
                console.log(voterAddress)
                console.log(voterList)
                voterList.map(async(el) => {
                    const singleVoterData = await contract.getVoterdata(el);
                    pushVoter.push(singleVoterData);
                    console.log(singleVoterData)
                    console.log("ARRAY", pushVoter)
                }) 
            } else {
                console.log("Ethereum object not found, install Metamask.");
            }

        }catch(error) {
            console.log(error)

        }
          
    }

    const setCandidate = async(candidateForm, fileUrl, router)=> {
        try{
            
            const {name, address, age} = candidateForm;
            
            
            if(!name || !address ||!age || !fileUrl)  {
                return console.log("Candidate Input data is missing");
            }
            //console.log("TESTING", name, address, age, fileUrl);
            //CONNECTING SMART CONTRACT 2
            
            if(window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(VotingAddress, ABI, signer);
                console.log(contract)
                const data = JSON.stringify({name, address, fileUrl, age})
                const added = await client.add(data);
               
                const ipfs =`https://voting01.infura-ipfs.io/ipfs/${added.path}`;
        
                const candidate = await contract.setCandidate(address, age, name , fileUrl, ipfs)
                candidate.wait();
                console.log("candidate",candidate)
                console.log("test test")
                getNewCandidate();
               // router.push("/")
                
                
            }
            

        } catch(error) {
            setError("Error in creating voter")
        }
    }
    
    const getNewCandidate = async() => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(VotingAddress, ABI, provider);
            const allCandidate = await contract.getCandidate()
            allCandidate.map(async(e) => {
                const singleCandidatedata = await contract.getCandidatedata(e);
                pushCandidate.push(singleCandidatedata)
                console.log("SINGEL CANDIDATE DATA",singleCandidatedata)
                //candidateIndex.push(singleCandidatedata[2].toNumber());
                console.log(singleCandidatedata)
                
            })
            

            const allCandidateLength = await contract.getCandidateLength();
            setCandidateLength(allCandidateLength.toNumber());
            console.log(candidateLength);

        } catch(error) {
            console.log(error)
        }
    }
    const giveVote= async(id) =>{
        try{
            
        } catch(error) {
            console.log(error)
        }
    }

   
   useEffect(() => {
   // getAllVoterData();
    checkIFWalletIsConnected();
    connectWallet();
    getNewCandidate();
    console.log("ARRAAY",candidateArray)

}, [currentAccount])



    return (
        <VotingContext.Provider value={{votingTitle, checkIFWalletIsConnected, connectWallet, uploadToIPFS, getAllVoterData, createVoter,setCandidate, getNewCandidate, error, voterArray, candidateArray, voterLength, voterAddress, currentAccount, candidateLength, giveVote, uploadToIPFSCandidate}}>
            {children}
        </VotingContext.Provider>
    )
}

