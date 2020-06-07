import React from 'react';
import { initializedFirebaseApp } from '../configs/firebase';
import { Link } from 'react-router-dom';
import { Checkbox, PageContainer } from './commons'
import {connect} from 'react-redux';
import {updateUserData} from '../actions/auth';

const mapDisptachToProps = (dispatch) => ({
    updateUser: (user) => dispatch(updateUserData(user))
})

const mapStateToProps = ({auth}) => ({
    isLoggedIn: !!auth.user,
    relatedAnswers: auth.user && auth.user.data? auth.user.data.relatedAnswers : []
})

export const AddAnswer = connect(mapStateToProps,mapDisptachToProps)
(({isLoggedIn,relatedAnswers,updateUser}) => {
    const [answer, setAnswer] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [load,setLoad] = React.useState(false);

    function onPress(){
        setLoad(true)
        if(answer === '') return;
        const newAnswer = {
            a:answer,
            createAt: new Date().getTime() % 10000,
            updateAt: new Date().getTime()
        }
        initializedFirebaseApp.database().ref('answers').push(newAnswer)
        .then((snap) => {
            if(isLoggedIn){
                relatedAnswers.push(snap.key);
                updateUser({relatedAnswers});
            }
            setAnswer('')
            setSuccess(true)
            setLoad(false);
        })
    }

    return (
        <PageContainer>
        <h4 className="page-section-heading">הוספת תגובה</h4>
            <div className="panel panel-default" style={{padding: "15px", display: 'inline-block', width: "100%"}}>
                {success&&<div className="alert alert-success">תגובה נוספה בהצלחה</div>}
                <div className="form-group"  style={{display:'flex', flexDirection: 'row-reverse'}}>
                    <div className="col-sm-10">
                        <input  type="text" 
                                className="form-control" 
                                value={answer} 
                                onChange={(event) => {
                                    setAnswer(event.target.value);
                                    setSuccess(false)
                                }}/>
                    </div>            

                    <label className="col-sm-2 control-label" htmlFor="video-id">תגובה</label>
                </div>
            </div>
            <center>
                <button className="btn btn-primary" onClick={() => onPress()} disabled={load}>שלח</button>
            </center>
            <br/>
            <br/>
            <center>
                <Link to="/">חזרה לעמוד הראשי</Link> 
            </center>
        </PageContainer>
                    
    )
})