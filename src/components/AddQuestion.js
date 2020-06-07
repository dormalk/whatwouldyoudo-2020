import React from 'react';
import { initializedFirebaseApp } from '../configs/firebase';
import { Link } from 'react-router-dom';
import { PageContainer } from './commons';
import {connect} from 'react-redux';
import {updateUserData} from '../actions/auth';
import {withRouter} from 'react-router-dom';
const mapDisptachToProps = (dispatch) => ({
    updateUser: (user) => dispatch(updateUserData(user))
})

const mapStateToProps = ({auth}) => ({
    relatedQuestions: auth.data && auth.data.relatedQuestions? auth.data.relatedQuestions : [],
})


export const AddQuestion = connect(mapStateToProps,mapDisptachToProps)
(withRouter(({isLoggedIn,relatedQuestions,updateUser,match,history}) => {
    const [question, setQuestion] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [load,setLoad] = React.useState(false);
    const [editMode,] =React.useState(!!match.params.id)


    React.useEffect(() => {
        if(editMode){
            const {id} = match.params;
            setLoad(true);
            if(relatedQuestions.includes(id)){
                initializedFirebaseApp.database().ref('questions').child(id)
                .once('value', snap => {
                    const {q} = snap.val();
                    setQuestion(q)
                    setLoad(false);
                })
            }
        }
    },[relatedQuestions])

    function onPress(){
        setLoad(true)
        if(question === '') return; 
        const newQuestion = {
            q:question,
            createAt: new Date().getTime() % 10000,
            updateAt: new Date().getTime()
        }
        if(editMode){
            initializedFirebaseApp.database().ref('questions').child(match.params.id).set(newQuestion)
            .then(() => {
                setQuestion('')
                setSuccess(true)
                setLoad(false);
                history.push('/question/'+match.params.id)
            })
        } else {
            initializedFirebaseApp.database().ref('questions').push(newQuestion)
            .then((snap) => {
                if(isLoggedIn){
                    relatedQuestions.push(snap.key);
                    updateUser({relatedQuestions});
                }
                setQuestion('')
                setSuccess(true)
                setLoad(false);
            })
        }
    }

    return (
        <PageContainer>
            <h4 className="page-section-heading">{!editMode? 'הוספת סיטואציה':'עריכת סיטואציה'}</h4>
            <div className="panel panel-default" style={{padding: "15px", display: 'inline-block', width: "100%"}}>
                {success&&<div className="alert alert-success">{editMode? 'סיטואציה עודכנה בהצלחה':'סיטואציה נוספה בהצלחה'}</div>}
                <div className="form-group" style={{display:'flex', flexDirection: 'row-reverse'}}>
                    <div className="col-sm-10">
                        <input  type="text" 
                                className="form-control" 
                                value={question} 
                                onChange={(event) => {
                                    setQuestion(event.target.value);
                                    setSuccess(false)
                                }}/>
                    </div>            

                    <label className="col-sm-2 control-label" htmlFor="video-id">סיטואציה</label>
                </div>
            </div>
            <center>
                <button className="btn btn-primary" onClick={() => onPress()} disabled={load}>{!editMode? 'הוספה':'עדכון'}</button>
            </center>
            <br/>
            <br/>
            <center>
                <Link to="/">חזרה לעמוד הראשי</Link> 
            </center>

        </PageContainer>


    )
}))