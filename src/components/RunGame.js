import React from 'react';
import { PageContainer, DefaultPanel,Loader } from './commons';
import { initializedFirebaseApp } from '../configs/firebase';
import { convertToArr } from '../configs/functions';
import {Link,withRouter} from 'react-router-dom';

let ans = [];


export const RunGame = withRouter(({history}) => {
    const [load, setLoad] = React.useState(false);
    const [showVote,setShowVote] = React.useState(false);
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

    function vote(answerId) {
        if(showVote) return;
        setLoad(true);
        Promise.all(randAnsState.map(a => {
            if(a.id === answerId) a.votes++;
            return updateVote(question.id,a);
        })).then(val => {
            setRandAns(
                randAnsState.map(a => {
                    if(a.id === answerId) a.votes++;
                    return a;
                })
            );
            setShowVote(answerId);
            setLoad(false);
        })
    }

    function setVotes(quId,randAns){
        Promise.all(randAns.map(an => fetchVote(quId,an.id)))
        .then((respones) => {
            const updatedRandAnss = randAns.map(an => {
                const res_ans = respones.find(res => res.id === an.id)
                an = {...an, ...res_ans};
                return an;
            })
            setRandAns(updatedRandAnss)
        })
        .catch((val) => console.error(val))
    }

    function fetchVote(quId,answerId){
        return new Promise((resolve,reject) => {
            initializedFirebaseApp.database().ref('votes').child(quId).child(answerId)
            .once('value',snapshot => {
                if(snapshot.val()) resolve(snapshot.val())
                else resolve({
                    id:answerId,
                    votesOffset: Math.floor(Math.random()*350 + 50),
                    votes: 0
                })
            }).catch((err) => 
            resolve({
                    id:answerId,
                    votesOffset: Math.floor(Math.random()*350 + 50),
                    votes: 0
                }))
        })
    }

    function updateVote(quId,answer){
        return initializedFirebaseApp.database().ref('votes').child(quId).child(answer.id)
        .update(answer)
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


    function next(){
        console.log(ans)
        setShowVote(null)
        setQuestion(null)
        setRandAns([])
        setLoad(true)
        fetchQuestions()
        .then(value => {
            if(value) setQuestion(value);
            const randAns = getRandomAnswers(); 
            setRandAns(randAns)
            if(value) setVotes(value.id,randAns)
        }).catch((err) => console.error(err))
        .finally(() => setLoad(false))
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


    // generate random timestamp.
    function getRndTimestamp() {
        // max timestamp
        return new Date().getTime() % 10000;
    }


    return(
        <PageContainer id="run_game">
            <DefaultPanel title="המשחק">
                {
                question &&
                <React.Fragment>

                    <div className="pull-left">
                        <a onClick={() => history.push('alldata')}>
                            צפה בנתונים <i className="fa fa-eye"></i>
                        </a>
                    </div>
                    <div className="form-group" style={{margin: "15px"}}>
                            <span style={{fontSize: "16px"}}>
                                <u><b>סיטואציה:</b></u> {question.q}<hr/>
                                <center><strong>
                                מה אתם הייתם עושים?
                                </strong></center>
                            </span>
                    </div>
                </React.Fragment>
                }
                {
                    randAnsState.map((an,index) => {
                        return(
                            <div key={index} className="panel panel-default ans" onClick={() => vote(an.id)} style={{fontWeight: showVote===an.id? 'bolder': ''}}>
                                {(index+1)}. {an.a} <br/> {showVote && `${  (an.votesOffset + an.votes)} הצבעות`}
                            </div>
                        )
                    })
                }
                {!question && <Loader/>}
                <center>
                    <button className="btn btn-primary" onClick={() => next()} disabled={load}>הבא</button>
                </center>
            </DefaultPanel>
        
            <br/>

            <div className="row">
                <center>
                    <Link to="/addQuestion">שתפו אותנו בסיטואציה מעניינת שחוויתם</Link> 
                    <hr/>
                    <Link to="/addAnswer">מוזמנים להרחיב את מאגר התגובות שלנו</Link>
                </center>
                <br/>
                <br/>    
            </div>
        </PageContainer>
    )
})