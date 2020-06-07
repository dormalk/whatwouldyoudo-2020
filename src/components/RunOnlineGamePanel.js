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
        if(!session.pickedAnswer || session.pickedAnswer === '') fetchAnswers(() =>next());

        window.addEventListener("beforeunload", (ev) => 
        {  
            ev.preventDefault();
            if(session.sessionId) {
                if(uid === session.createBy){
                    initializedFirebaseApp.database().ref('sessions')
                    .child(session.sessionId).remove()
                } else {
                    const { participents } = session.participents;
                    session.participents = participents.filter(participent => participent.id !== uid);
                    updateSession(session)
                }
            }        

            return ev.returnValue = 'Are you sure you want to close?';
        });


    },[session.pickedAnswer])

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
        var {  judgeIndex } = session;
        return judgeIndex;
    }

    function next(){
        setQuestion(null)
        setRandAns([])
        setLoad(true)
        if(uid === getJudgeId()){
            fetchQuestions()
            .then(value => {
                const {participents} = session;
                session.pickedAnswer = '';
                session.participents = participents
                .filter(participent => participent !== '')
                .map(participent => {
                    participent.answer = '';
                    return participent
                });
                for(let i = 0, len=session.participents.length; i < len; i++){
                    console.log(session.participents)
                    if(session.participents[i].id && session.participents[i].id === session.judgeIndex) {
                        if((i + 1) < len) session.judgeIndex = session.participents[i+1].id;
                        else session.judgeIndex = session.participents[0].id
                        break;
                    }
                }
                console.log(session.judgeIndex)
                session.questionObj = value;
                debugger;
                initializedFirebaseApp.database().ref('sessions').child(session.sessionId).update(session)
                .then(() => {
                    const randAns = getRandomAnswers(); 
                    setRandAns(randAns)
    
                })
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
        updateSession(session)
    }


    function updateJougeChoose(answer){
        if(!!session.pickedAnswer || session.pickedAnswer !== '' ) return;
        var { participents } = session;
        session.pickedAnswer = answer;
        session.participents = participents.map(participent => {
            if(participent.answer === answer) participent.points += 1;
            return participent
        })

        initializedFirebaseApp.database()
        .ref('sessions')
        .child(session.sessionId)
        .update(session)
    }


    function getParticipentPick(uid){
        const participent = session.participents? session.participents.find(participent => participent.id === uid) : undefined
        if(participent) return participent.answer;
        else return '';
    }

    function updateSession(session){
        if(getJudgeId() === uid){            
            return initializedFirebaseApp.database()
            .ref('sessions')
            .child(session.sessionId)
            .update(session)
        } else {
            return initializedFirebaseApp.database()
            .ref('sessions')
            .child(session.sessionId)
            .child('participents')
            .update(session.participents)
        }


    }


    return (
        <DefaultPanel title={`שם החדר - ${session.sessionId}`} style={{border: getJudgeId() === uid? '1px solid #e74c3c' : ''}}>
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
                uid !== getJudgeId() && getParticipentPick(uid) === '' && randAnsState.map((an,index) => {
                    return(
                        <div key={index} className="panel panel-default ans" onClick={() => updateParticipentChoose(uid,an.a)} style={{fontWeight: an.id === '1'? 'bolder': ''}}>
                            {(index+1)}. {an.a}
                        </div>
                    )
                })
            }
            {
                uid !== getJudgeId() && 
                getParticipentPick(uid) !== '' &&
                session.participents
                .filter(participent => participent.answer && participent.answer !== '')
                .map((participent,index) => {
                    return(
                        <div key={index} className="panel panel-default ans" style={{fontWeight: participent.id === uid? 'bolder': '', backgroundColor: session.pickedAnswer === participent.answer? '#e74c3c':''}}>
                            {(index+1)}. {participent.answer}
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
                        <div key={index} className="panel panel-default ans"  onClick={() => updateJougeChoose(participent.answer)} style={{fontWeight: session.pickedAnswer === participent.ansewer? 'bolder': '',backgroundColor: session.pickedAnswer === participent.answer? '#e74c3c':''}}>
                            {(index+1)}. {participent.answer}
                        </div>
                    )
                })

            }
            {uid === getJudgeId() && session.pickedAnswer && <button className="btn btn-primary" onClick={() => next()}>הבא</button>}
            {!session.questionObj && <Loader/>}

        </DefaultPanel>
    )
}