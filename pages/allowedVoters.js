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
    
    const [formInput, setFormInput] = useState({
        name: "",
        address: "",
        position: "",
        image:"",
    });
    
    const router = useRouter();
    const {uploadToIPFS, createVoter, voterArray, getAllVoterData} = useContext(VotingContext);

    //VOTERS IMAGE DROP
    const onDrop = useCallback(async (acceptedFil) => {
        const file = acceptedFil[0]
        
        const url = await uploadToIPFS(file);
        
        
        setFileUrl(url);
    });
    async function handleFileChange(e) {
    
        const file = e.target.files[0]
        try {
            setFormInput({ ...formInput, image: file });
       
            const url =  await uploadToIPFS(file);
            
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
        console.log(voterArray);
        getAllVoterData();
        
    },[]);


    return (
        <div className={Style.createVoter}>
            <div>
                {fileUrl && (
                    <div className={Style.voterInfo}>
                        <img alt="Voter Image" layout="fill" src={fileUrl}/>
                        <div className={Style.voterInfo_paragraph}>
                            <p>
                                Name: <span>&nbsp; {formInput.name} </span>
                            </p>
                            <p>
                                Add: &nbsp; <span>{formInput.address.slice(0,20)}</span>
                            </p>
                            <p>
                                Pos: &nbsp; <span>{formInput.position}</span>
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
                            {voterArray.map((el, i) => (
                                <div key={i+1} className={Style.card_box}> 
                                    <div className={Style.image}>
                                        <img src={el[2]} alt="Profile photo"/>
                                    </div>

                                    <div className={Style.card_info}> 
                                    <p>Name: {el[1]} </p>
                                    <p>Address: {el[3].slice(0,10)}...</p>
                              
                                    </div>
                                </div>
                            ))}
                        </div>
                       
                    </div>
                )}
            </div>

            <div className={Style.voter}>
                <div className={Style.voter__container}>
                    <h1> Create New Voter</h1>
                    
                </div>


                <div className={Style.input__container}>
                    <Input inputType="file" title="Image" placeholder="upload image" handleClick={handleFileChange} />
                    <Input inputType="text" title="Name" placeholder="Voter Name" handleClick={(e) => setFormInput({ ...formInput, name:e.target.value})}/>
                    <Input inputType="text" title="Address" placeholder="Voter address" handleClick={(e) => setFormInput({ ...formInput, address:e.target.value})}/>
                    <Input inputType="text" title="Position" placeholder="Voter Position" handleClick={(e) => setFormInput({ ...formInput, position:e.target.value})}/>

                    <div className={Style.Button}><Button btnName="authorized voter" handleClick={()=>{createVoter(formInput, fileUrl, router)}}></Button></div>
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