import { authService, dbService } from 'fBase';
import React,{useEffect,useState} from 'react';
import { useHistory } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

export default ({userInfo})=>{
    const userId=userInfo[Object.keys(userInfo)[0]].uid;
    const userName=userInfo[Object.keys(userInfo)[0]].displayName;
    const [newDisplayName, setNewDisplayName] = useState(userName);
    
    const history=useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onChange = (event) =>{
        const{
            target : {value},
        } = event;
        setNewDisplayName(value);
    }

    const getMyTweets = async () => {
        const q = query( 
            // firebase의 collection인 dbService에서 tweets를 변수 q에 가져온다
            // 이 때 조건 : tweet의 creatorId와 현재 로그인 중인 userId가 동일한 tweet
            collection(dbService, "tweets"),
            where("creatorId", "==", userId)
            , orderBy('createdAt', 'desc')
        );
        
        //q에 저장된 documents들을 가져와 querySnapshot에 저장
        const querySnapshot = await getDocs(q);
        
        //querySnapshot을 순회하며 현재 login 중인 user가 작성했던 tweet을 가져온다.
        querySnapshot.forEach((doc) => { 
            console.log(doc.id, " => ", doc.data());
        });
    };

    useEffect(() => {
        getMyTweets();
    }, [])

    const onSubmit=async(event)=>{
        event.preventDefault();
        if (userName !== newDisplayName) {
            await updateProfile(userInfo[Object.keys(userInfo)[0]], { displayName: newDisplayName });
        }
    };

    return(
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Display name" 
                    onChange={onChange} value={newDisplayName}/>
                <input type="submit" value="Update Profile"/>
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};