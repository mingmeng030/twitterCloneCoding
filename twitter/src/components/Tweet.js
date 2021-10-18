import React, {useState} from 'react';
import { deleteDoc, updateDoc, doc } from '@firebase/firestore'
import { dbService, storageService } from "fBase";
import { ref, deleteObject } from "@firebase/storage";


const Tweet = ({ tweetObj, isOwner})=>{
    const TweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
    const [editing, setEditing]= useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    
    const onDeleteClick = async() =>{
        const ok=window.confirm("Are you sure you wanna delete this tweet?");
        if (ok) {
            await deleteDoc(doc(dbService, `tweets/${tweetObj.id}`));
            if(tweetObj.attachmentUrl)
                await deleteObject(ref(storageService, tweetObj.attachmentUrl));    
        }
    };

    const onSubmit=async(e)=>{
        e.preventDefault();
        await updateDoc(TweetTextRef, { text: newTweet });
        setEditing(false);
    };

    const onChange =(e)=>{
        const{ target : {value} }= e;
        setNewTweet(value);
    };

    const toggledEditing = () => setEditing((prev)=>!prev);

    return(
        <div>
            { editing ? 
                <>
                    <form onSubmit={onSubmit}>
                        <input type="text" placeholder="Edit your tweet"
                        value={newTweet} required onChange={onChange}/>
                        <input type="submit" value="Update Tweet"/>
                    </form> 
                    <button onClick={toggledEditing}>Cancel</button>
                </>
                : <> 
                    <h4>{tweetObj.text}</h4>
                    {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} width="100px" height="100px" /> }
                    {isOwner&&(
                    <>
                        <button onClick={onDeleteClick}>Delete Tweet</button>
                        <button onClick={toggledEditing}>Edit Tweet</button>
                    </>
                    )} 
             </>
            }
        </div>
    );
}

export default Tweet;