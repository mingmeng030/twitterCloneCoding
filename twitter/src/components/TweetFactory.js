import { dbService, storageService } from "fBase";
import {v4} from 'uuid';
import React, {useState } from "react";
import { ref, uploadString,getDownloadURL } from "@firebase/storage";
import { collection, addDoc, serverTimestamp } from '@firebase/firestore'

const TweetFactory = ({userInfo}) =>{
    const userId=userInfo[Object.keys(userInfo)[0]].uid;
    const [tweet, setTweet] = useState('');
    const [attachment, setAttachment] = useState("");

    const OnSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = "";

        if (attachment !== "") {
            const fileRef = ref(storageService, `${userId}/${v4()}`);
            const uploadFile = await uploadString(fileRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(uploadFile.ref);
        }

        const tweetObj = {
            text : tweet,
            createdAt: serverTimestamp(),
            creatorId : userId,
            attachmentUrl
        };
        
        await addDoc(collection(dbService, "tweets"),tweetObj);
        setTweet("");
        setAttachment("");
    }

    const OnChange = (e) => {
        const { target: { value } } = e
        setTweet(value);
    }

    const onFileChange = (event) =>{
        const {
            target : {files},
        } = event;

        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) =>{
            const {
                currentTarget : {result},
            }=finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment=()=>setAttachment("");

    return(
        <form onSubmit={OnSubmit}>
            <input type="text" placeholder="What's on your mind?" 
            maxLength={120} onChange={OnChange} value={tweet} />
            <input type="file" accept="image/*" onChange={onFileChange}/>
            <input type="submit" value="Tweet" />
            {attachment&&(
                <div>
                    <img src={attachment} width="100px" height="100px"/>
                    <button onClick={onClearAttachment}>Clear Photo</button>
                </div>
            )}
        </form>
    )
}

export default TweetFactory;