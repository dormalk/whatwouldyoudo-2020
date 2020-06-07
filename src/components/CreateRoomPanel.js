import React from 'react';
import { DefaultPanel } from './commons';
import { initializedFirebaseApp } from '../configs/firebase';
import { generateUniqKey } from '../helpers/fucntions';
import {withRouter} from 'react-router-dom';

const INITIAL_SESSION = {
    createBy: '',
    participents: [],
    status: 'WAITING',
    qustionObj: {},
    judgeIndex: 0,
    gameType: '',
    pickedAnswer: null
}


export const CreateRoomPanel = withRouter(({history, uid}) => {
    const [choose, setChoose] = React.useState(null);
    const [sessionId, setSessionId] = React.useState('');
    const [gameType, setGameType] = React.useState('classic');



    function createNewSession() {
        var newSession = {
            ...INITIAL_SESSION
        }
        newSession.createBy = uid? uid : generateUniqKey(8)
        newSession.judgeIndex = newSession.createBy; 

        initializedFirebaseApp.database().ref('sessions/'+sessionId)
        .set(newSession)
        .then(() => {
            history.push('/playonline?id='+sessionId)
        })
    }

    function onJoinToSession() {
        history.push('/playonline?id='+sessionId)
    }

    return (
        <DefaultPanel title="יצירת משחק">
            <div className="row">
                <div className="col" onClick={() =>setChoose('create')}>אני רוצה ליצור משחק חדש</div>
                <div className="col" onClick={() =>setChoose('join')}>אני רוצה להצטרף למשחק קיים</div>
            </div>
            <hr/>
            {
                choose === 'create' &&
                (
                    <React.Fragment>
                        <div className="form-group"  style={{display:'flex', flexDirection: 'row-reverse'}}>
                            <div className="col-sm-10">
                                <input  type="text" 
                                        className="form-control" 
                                        value={sessionId} 
                                        id="sessionId"
                                        onChange={(event) => !event.target.value.includes(' ') && setSessionId(event.target.value)}/>
                            </div>            
                            <label className="col-sm-2 control-label" htmlFor="sessionId">שם החדר</label>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-6">
                                <div className="radio radio-primary">
                                    <input  type="radio" 
                                            name="radio1" 
                                            id="radio11" 
                                            value="option1" 
                                            checked={gameType === "classic"}
                                            onChange={() => setGameType("classic")}/>
                                    <label htmlFor="radio11">משחק קלאסי</label>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="radio radio-primary">
                                    <input  type="radio" 
                                            name="radio2" 
                                            id="radio12" 
                                            value="option2" 
                                            checked={gameType === "free"}
                                            onChange={() => setGameType("free")}/>

                                    <label htmlFor="radio12">סגנון חופשי</label>
                                </div>
                            </div>
                        </div>
                        {
                            sessionId && sessionId.length > 4 && gameType && (
                                <center>
                                    <button style={{margin: '0.5rem'}} className="btn btn-primary" onClick={() => createNewSession()}>צא לדרך!</button>
                                </center>
                            )
                        }
                    </React.Fragment>

                )
            }
            {
                choose === 'join' &&
                <React.Fragment>
                    <div className="form-group"  style={{display:'flex', flexDirection: 'row-reverse'}}>
                        <div className="col-sm-10">
                            <input  type="text" 
                                    className="form-control" 
                                    value={sessionId} 
                                    id="sessionId"
                                    onChange={(event) => !event.target.value.includes(' ') && setSessionId(event.target.value)}/>
                        </div>            
                        <label className="col-sm-2 control-label" htmlFor="sessionId">שם החדר</label>
                    </div>
                    {
                        sessionId && sessionId.length > 4 && (
                            <center>
                                <button style={{margin: '0.5rem'}} className="btn btn-primary" onClick={() => onJoinToSession()}>צא לדרך!</button>
                            </center>
                        )
                    }
                </React.Fragment>
            }
        </DefaultPanel>
    )
})