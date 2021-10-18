import { dbService } from "fBase";
import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from '@firebase/firestore'
import Tweet from "../components/Tweet";
import TweetFactory from "components/TweetFactory";

const Home = ({userInfo}) => {
    const userId=userInfo[Object.keys(userInfo)[0]].uid;
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
        return () => { unsubscribe(); }
    }, []);

    return (
        <div>
            <TweetFactory userInfo={userInfo}/>
            <div>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} 
                    tweetObj={tweet} 
                    isOwner={tweet.creatorId===userId}
                    />
                ))}
            </div>
        </div>
    )
}
export default Home;