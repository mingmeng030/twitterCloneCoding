import { dbService } from "fBase";
import React, { useEffect, useState } from "react";
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from '@firebase/firestore'
import Tweet from "../components/Tweet";

const Home = ({userInfo}) => {
    const [tweet, setTweet] = useState('');
    const [tweets, setTweets] = useState([]);

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
        e.preventDefault()
        const docRef = await addDoc(collection(dbService, 'tweets'), {
            text : tweet,
            createdAt: serverTimestamp(),
            creatorId : userInfo[Object.keys(userInfo)[0]].uid,
        })
        console.log('Document written with ID: ', docRef.id);
        setTweet('');
    }

    const OnChange = (e) => {
        const { target: { value } } = e
        setTweet(value);
    }

    return (
        <div>
            <form onSubmit={OnSubmit}>
                <input type="text" placeholder="What's on your mind?" maxLength={120} onChange={OnChange} value={tweet} />
                <input type="submit" value="Tweet" />
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