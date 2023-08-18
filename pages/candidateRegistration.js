import React, {useState, useEffect, useCallback, useContext} from 'react'
import {useRouter} from 'next/router';
import {useDropzone} from "react-dropzone";
import Image from "next/image";

import {VotingContext} from "../context/Voter";
import Style from '../styles/allowedVoters.module.css';
import creator from '../assets/creator.jpg';
import upload from '../assets/upload.png'
import Button from "../components/Button/Button"
import Input from "../components/Input/Input"

const allowedVoters = () => {
    const [fileUrl, setFileUrl] = useState(null);
    
    const [candidateForm, setCandidateForm] = useState({
        name: "",
        address: "",
        age: "",
        image: "",
    });
    
    const router = useRouter();
    const {setCandidate, uploadToIPFSCandidate, candidateArray, getNewCandidate} = useContext(VotingContext);

    //VOTERS IMAGE DROP
    const onDrop = useCallback(async (acceptedFil) => {
        const file = acceptedFil[0]
        
        const url = await uploadToIPFSCandidate(file);
        
        
        setFileUrl(url);
    });
    async function handleFileChange(e) {
    
        const file = e.target.files[0]
        try {
            setCandidateForm({ ...candidateForm, image: file });
       
            const url =  await uploadToIPFSCandidate(file);
            
            setFileUrl(url)
        } catch (error) {
        console.log('Error uploading file: ', error)
        }  
    }

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: "image/*",
        maxSize: 5000000,
    });

   
    //JSX PART  1:16
    useEffect(()=>{
        getNewCandidate();
    },[]);


    return (
        <div className={Style.createVoter}>
            <div>
                {fileUrl && (
                    <div className={Style.voterInfo}>
                        <img alt="Voter Image" layout="fill" src={fileUrl}/>
                        <div className={Style.voterInfo_paragraph}>
                            <p>
                                Name: <span>&nbsp; {candidateForm.name} </span>
                            </p>
                            <p>
                                Add: &nbsp; <span>{candidateForm.address.slice(0,20)}</span>
                            </p>
                            <p>
                                Age: &nbsp; <span>{candidateForm.age}</span>
                            </p>
                        </div>
                    </div>
                )}
    
                {!fileUrl && (
                    <div className={Style.sideInfo}>
                        <div className={Style.sideInfo_box}>
                            <h4> Create candidate for Voting</h4>
                            <p> Blockchain voting orgnization, provide blockchain ecostystem</p>
                            <p className={Style.sideInfo_para}> Contract Canddite</p>
                                                    
                        </div>
                        <div className={Style.card}>
                            {candidateArray.map((el, i) => (
                                <div key={i+1} className={Style.card_box}> 
                                    <div className={Style.image}>
                                        <img src={el[3]} alt="Profile photo"/>
                                    </div>

                                    <div className={Style.card_info}> 
                                    <p>Name:{el[1]}</p>
                                    <p>Address{el[6].slice(0,10)}</p>
                                    <p>Details</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                       
                    </div>
                )}
            </div>

            <div className={Style.voter}>
                <div className={Style.voter__container}>
                    <h1> Candidate Registration</h1>
                    
                </div>


                <div className={Style.input__container}>
                    <Input inputType="file" title="Image" placeholder="upload image" handleClick={handleFileChange} />
                    <Input inputType="text" title="Name" placeholder="Candidate Name" handleClick={(e) => setCandidateForm({ ...candidateForm, name:e.target.value})}/>
                    <Input inputType="text" title="Address" placeholder="Candidate address" handleClick={(e) => setCandidateForm({ ...candidateForm, address:e.target.value})}/>
                    <Input inputType="text" title="Age" placeholder="Age" handleClick={(e) => setCandidateForm({ ...candidateForm, age:e.target.value})}/>

                    <div className={Style.Button}><Button btnName="authorize candidate" handleClick={()=>{setCandidate(candidateForm, fileUrl, router)}}></Button></div>
                </div> 
            </div>
            {/* //////////*/}
            <div className={Style.createdVoter}>
                <div className={Style.createdVoter__info}>
                    <Image src={creator} alt="userProfile" />
                    <p>Notice for user</p>
                    <p>Organizer <span> 0x939939..</span></p>
                    <p>Only organizer of the voting contract can create voter for voting election</p>
                </div>
            </div>



        </div>
    );
}

export default allowedVoters;