import React from 'react';
import { PageContainer, Loader } from './commons';
import { getParamsFromUrl } from '../helpers/urls';
import { RunOnlineRoomPanel } from './RunOnlineGamePanel';
import { CreateRoomPanel } from './CreateRoomPanel';
import { initializedFirebaseApp } from '../configs/firebase';
import { generateUniqKey } from '../helpers/fucntions';
import { getItemFromStorage, setItemToStorage } from '../helpers/storage';

const INITIAL_PARTICIPENT = {
    id: '',
    answer: '',
    points: 0
}


export const OnlineRoom = ({uid}) => {
    const [isSession, setIsSession] = React.useState(null);
    const [session, setSession] = React.useState(null);
    const [userId,] = React.useState(uid || genereateUid())

    function genereateUid() {
        var uid = localStorage.getItem('uid');
        if(!uid){
            uid = generateUniqKey(8);
            localStorage.setItem('uid',uid);
        }
        return uid;
    }

    React.useEffect(() => {
        const id = getParamsFromUrl('id');
        if(id) {
            initializedFirebaseApp.database().ref('sessions')
            .child(id)
            .on('value', snapshot => {
                setSession({...snapshot.val(), sessionId: snapshot.key})              
                addParticipentToSession({...snapshot.val(), sessionId: snapshot.key})
                setIsSession(true)
            })
        } else {
            setIsSession(false)
        }
        return(() => {
            if(id) initializedFirebaseApp.database().ref('sessions')
                    .child(id).remove()
        })
    },[setIsSession,getParamsFromUrl('id')])

    function addParticipentToSession(session){
        var newParticipent = INITIAL_PARTICIPENT;
        if(!session.participents) session.participents = [];
        if(!session.participents.find(participent => participent.id === userId)) {
            newParticipent.id = userId;
            session.participents = [...session.participents,newParticipent]

            initializedFirebaseApp.database().ref('sessions')
                        .child(session.sessionId)
                        .update(session)
        }

    }

    return(
        <PageContainer id="online_room">
            <center>
                <h1>שחקו אונליין</h1>
            </center>
            {
                isSession === null && <Loader/>
            }
            {
                isSession === true? 
                <RunOnlineRoomPanel session={session} uid={userId}/>:
                <CreateRoomPanel uid={userId}/>
            }
        </PageContainer>
    )
}