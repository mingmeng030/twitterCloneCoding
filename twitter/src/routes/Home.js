import { dbService, storageService } from "fBase";
import {v4} from 'uuid';
import React, { useEffect, useState } from "react";
import { ref, uploadString,getDownloadURL } from "@firebase/storage";
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from '@firebase/firestore'
import Tweet from "../components/Tweet";

const Home = ({userInfo}) => {
    const [tweet, setTweet] = useState('');
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect(() => {
        const q = query(collection(dbService, 'tweets'), orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const nextTweets = querySnapshot.docs.map((document) => {
                return {
                    id: document.id,
                    ...document.data(),
                }
            })
            setTweets(nextTweets);
        })
        return () => {
            unsubscribe();
        }
    }, [])

    const OnSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = "";
        //npm install uuid : 특정 식별자를 랜덤으로 생성해준다.
        //fileRef : file에 대한 reference를 가짐
        if (attachment !== "") {
            const fileRef = ref(storageService, `${userInfo[Object.keys(userInfo)[0]].uid}/${v4()}`);
            const uploadFile = await uploadString(fileRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(uploadFile.ref);
        }

        const tweetObj = {
            text : tweet,
            createdAt: serverTimestamp(),
            creatorId : userInfo[Object.keys(userInfo)[0]].uid,
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
        const { //event의 target안으로 가서 files를 받아 변수로 저장
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

    return (
        <div>
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
            <div>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} 
                    tweetObj={tweet} 
                    isOwner={tweet.creatorId===userInfo[Object.keys(userInfo)[0]].uid}
                    />
                ))}
            </div>
        </div>
    )
}
export default Home;