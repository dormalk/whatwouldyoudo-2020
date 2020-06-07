import React from 'react';
import { DefaultPanel,Loader } from './commons';
import { initializedFirebaseApp } from '../configs/firebase';
import { convertToArr } from '../configs/functions';

let ans = [];

export const RunOnlineRoomPanel = ({session,uid}) => {

    const [load, setLoad] = React.useState(false);
    const [question, setQuestion] = React.useState(``)
    const [randAnsState, setRandAns] = React.useState([]);

    React.useEffect(() => {
        fetchAnswers(() =>next());
    },[])

    function fetchAnswers(callback){
        setLoad(true)
        return initializedFirebaseApp.database().ref('answers')
        .once('value',(snapshot) => {
            ans = convertToArr(snapshot.val());
            setLoad(false)
            if(callback) callback()
        })
    }

    function getRndTimestamp() {
        // max timestamp
        return new Date().getTime() % 10000;
    }

    function fetchQuestions(){
        var randomTime = getRndTimestamp();
        return new Promise((resolve,reject) => {
            initializedFirebaseApp.database().ref('questions')
            .orderByChild('createAt')
            .startAt(randomTime)
            .limitToFirst(1)
            .once('value',snapshot => {
                const qus = convertToArr(snapshot.val())[0];
                if(qus) resolve(qus)
                else 
                initializedFirebaseApp.database().ref('questions')
                .orderByChild('createAt')
                .endAt(randomTime)
                .limitToFirst(1)
                .once('value',snapshot => {
                    const qus = convertToArr(snapshot.val())[0];
                    if(qus) resolve(qus)
                    else reject();    
                })
            })
        })
    }

    function getRandomAnswers() {
        let randomAnswer = [];
        let rendTime = new Date().getTime() % 10000;

        ans.forEach(a => {
            let rand = Math.floor(Math.random()*6+1);
            if(randomAnswer.length < 5) {
                if(rand === 2 && a.createAt > rendTime) randomAnswer.push(a)
            }
        })
        if(randomAnswer.length < 5) {
            ans.forEach(a => {
                let rand = Math.floor(Math.random()*6+1);
                if(randomAnswer.length < 5) {
                    if(rand === 2) randomAnswer.push(a)
                }
            })    
        }
        if(ans) return randomAnswer.length === 5? randomAnswer : getRandomAnswers();
        else return [];
    }

    function getJudgeId(){
        const { participents, judgeIndex } = session;
        return participents[judgeIndex].id;
    }

    function next(){
        console.log(ans)
        setQuestion(null)
        setRandAns([])
        setLoad(true)
        if(uid === getJudgeId()){
            fetchQuestions()
            .then(value => {
                console.log(value)
                initializedFirebaseApp.database().ref('sessions').child(session.sessionId).update({questionObj:value})
                const randAns = getRandomAnswers(); 
                setRandAns(randAns)
            }).catch((err) => console.error(err))
            .finally(() => setLoad(false))
        } else {
            const randAns = getRandomAnswers(); 
            setRandAns(randAns)
        
        }

    }


    function updateParticipentChoose(participentId, answer){
        var { participents } = session;
        session.participents = participents.map(participent => {
            if(participent.id === participentId && participent.answer === '') participent.answer = answer;
            return participent
        })
        console.log(session.participents)
        updateSession(session)
    }


    function updateJougeChoose(answer){
        
    }

    function updateSession(session){
        initializedFirebaseApp.database()
        .ref('sessions')
        .child(session.sessionId)
        .update(session)

    }


    return (
        <DefaultPanel title={`שם החדר - ${session.sessionId}`}>
            {
                session.questionObj &&
                <React.Fragment>
                    <div className="form-group" style={{margin: "15px"}}>
                            <span style={{fontSize: "16px"}}>
                                <u><b>סיטואציה:</b></u> {session.questionObj.q}<hr/>
                                <center><strong>
                                מה אתם הייתם עושים?
                                </strong></center>
                            </span>
                    </div>
                </React.Fragment>
            }

            {
                uid !== getJudgeId() && randAnsState.map((an,index) => {
                    return(
                        <div key={index} className="panel panel-default ans" onClick={() => updateParticipentChoose(uid,an.a)} style={{fontWeight: an.id === '1'? 'bolder': ''}}>
                            {(index+1)}. {an.a}
                        </div>
                    )
                })
            }

            {
                uid === getJudgeId() && 
                session.participents
                .filter(participent => participent.answer && participent.answer !== '')
                .map((participent,index) => {
                    return(
                        <div key={index} className="panel panel-default ans"  style={{fontWeight: participent.id === '1'? 'bolder': ''}}>
                            {(index+1)}. {participent.answer}
                        </div>
                    )
                })

            }
            {!session.questionObj && <Loader/>}

        </DefaultPanel>
    )
}