import React, {useState} from 'react';
import { deleteDoc, updateDoc, doc } from '@firebase/firestore'
import { dbService } from "fBase";

const Tweet = ({ tweetObj, isOwner})=>{
    const TweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
    const [editing, setEditing]= useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    
    const onDeleteClick = async() =>{
        const ok=window.confirm("Are you sure you wanna delete this tweet?");
        if(ok) await deleteDoc(TweetTextRef);
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

    // return 문 내의 삼항연산자를 통해 editing이 true이면 edit form이 보이고
    // false 이면 edit form이 보이지 않는다.
    // toggledEditing은 setEditing의 상태를 true이면 false로 false이면 true로 변경한다.ㅁ
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