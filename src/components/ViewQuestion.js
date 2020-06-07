import React from 'react';
import { PageContainer, DefaultPanel,Loader,StickyElement } from './commons';
import { initializedFirebaseApp } from '../configs/firebase';
import { convertToArr } from '../configs/functions';
import  {connect} from 'react-redux';
import {updateUserData} from '../actions/auth';
import {withRouter} from 'react-router-dom';

const mapDisptachToProps = (dispatch) => ({
    updateUser: (user) => dispatch(updateUserData(user))
})

const mapStateToProps = ({auth}) => ({
    relatedQuestions: auth.data && auth.data.relatedQuestions? auth.data.relatedQuestions : [],
    isOrgenazation: auth.data && auth.data.isOrgenazation
})

export const ViewQustion = connect(mapStateToProps,mapDisptachToProps)
(withRouter(({relatedQuestions,match,updateUser,history,isOrgenazation}) => {
    const [question, setQuestion] = React.useState(null);
    const [answers, setAnswers] = React.useState(null);
    const [search,setSearch] = React.useState('');
    const [load, setLoad] = React.useState(false);
    const [votes, setVotes] = React.useState([]);

    const [vote, setVote] = React.useState(null);

    React.useEffect(() => {
        const {id} = match.params;
        setLoad(true);
        initializedFirebaseApp.database().ref('questions').child(id)
        .once('value',snapshot => {
            setQuestion(snapshot.val())
            initializedFirebaseApp.database().ref('answers')
            .once('value',snapshot => {
                setAnswers(convertToArr(snapshot.val()))
                fetchAllVotes(convertToArr(snapshot.val()).map(ans => ans.id))
                .then((data) => {
                    // const allVotes = data.filter(d => !!d.ansId) 
                    // setAnswers(convertToArr(snapshot.val()).filter((ans => allVotes.find(vote => vote.ansId === ans.id))))

                    setVotes(data)
                    setLoad(false)
                })
            })
        })
    }, [])

    const fetchAllVotes = (ansIds) => {
        let reads = [];
        const {id} = match.params;
        const ref = initializedFirebaseApp.database().ref('votes');
        ansIds.forEach(ansId => {
            var promise = ref.child(id).child(ansId).once('value')
            .then((snap) => ({...snap.val(), ansId: !!snap.val()? ansId : null}), (err) => console.error(err))
            reads.push(promise);
        })
        return Promise.all(reads)

    }

    const handleClickAnswer = (ansId) => {
        setVote({...votes.find(vote => vote.ansId === ansId), ansId})
    }


    const onClickRemove = () => {
        const {id} = match.params;
        setLoad(true);
        const relatedQuestionsNew = relatedQuestions.filter(questionId => questionId !== id);
        initializedFirebaseApp.database().ref('questions').child(id)
        .remove(() => {
            updateUser({relatedQuestions:relatedQuestionsNew})
            .then(() => {
                history.push('/userquestions')
            })
        })
    }

    function onVote(answerId) {
        const {id} = match.params;
        initializedFirebaseApp.database().ref('votes')
        .child(id)
        .child(answerId)
        .child('votes')
        .transaction(votes => {
            return (votes || 0) + 1
        })
        .then(() => {
            setVote({...votes.find(vote => vote.ansId === answerId), ansId:answerId, votes: (vote.votes || 0)+1})
            setVotes(votes.map((v) => {
                if(v.ansId === answerId) v.votes = (v.votes || 0) + 1;
                return v;   
            }))
        })
    }


    return(
        <PageContainer id="view_question">

            <DefaultPanel>
            {
                relatedQuestions.includes(match.params.id) &&
                <div className="form-group control_pannel">
                <i className="fa fa-edit" onClick={() => history.push('/question/edit/'+match.params.id)}></i>
                <i className="fa fa-remove" onClick={() => onClickRemove()}></i>
                </div>
            }
            
            <div className="form-group" style={{margin: "15px"}}>
            {
                question &&
                <React.Fragment>
                    <span style={{fontSize: "16px"}}>
                        <u><b>סיטואציה:</b></u> {question.q}<hr/>
                        <center><strong>
                        מה אתם הייתם עושים?
                        </strong></center>
                    </span>
                </React.Fragment>
            }
            </div>
            {
                !load&&answers &&
                <React.Fragment>
                    <StickyElement id="search">
                        <input type="text" className="form-control" name="search" placeholder="חיפוש תגובה" onChange={(event) => setSearch(event.target.value)}/>
                    </StickyElement>
                    <hr/>
                    {
                        answers.map((ans,index) => {
                        return ans.a.indexOf(search) >= 0?
                        (
                            <div key={index} className="panel panel-default ans" onClick={() => handleClickAnswer(ans.id)} style={{fontWeight: vote && vote.ansId === ans.id? 'bold': 'unset'}}>
                                {(index+1)}. {ans.a} {vote && vote.ansId === ans.id? `${  ((vote.votesOffset || 0) + (vote.votes || 0))} הצבעות` : null}
                                {
                                    isOrgenazation &&
                                    <i className="fa fa-plus-square pull-left" onClick={() => onVote(ans.id)}></i>
                                }
                            </div>
                        ): null;
                    })
                    }
                    {
                        !!answers && answers.length ===  0 &&
                        <div className="panel panel-default" style={{padding: '1rem', fontWeight: 'bold'}}>
                            <center>
                            אין תוצאות
                            </center>
                        </div>
                    }
                </React.Fragment>

            }
            {
                load && <Loader/>
            }
            </DefaultPanel>
        </PageContainer>
    )
}))