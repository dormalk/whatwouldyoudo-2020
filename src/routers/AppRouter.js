import React from 'react';
import {Switch,Route} from 'react-router-dom';
import {
    Main,
    AddQuestion,
    AddAnswer,
    AllDataPage,
    ViewQustion,
    Header,
    ViewUserQuestions,
    OnlineRoom
} from '../components';
import { RunGame } from '../components/RunGame';
import PrivateRoute from './PrivateRoute';

export default () => {
    return (
        <React.Fragment>
            <Header/>
            <Switch>
                <Route exact path="/" component={Main}/>
                <Route path="/addQuestion" component={AddQuestion}/>
                <Route path="/question/edit/:id" component={AddQuestion}/>
                <Route path="/addAnswer" component={AddAnswer}/>
                <Route path="/alldata" component={AllDataPage}/>
                <Route path="/question/:id" component={ViewQustion}/>
                <Route path="/rungame" component={RunGame}/>
                <PrivateRoute path="/userquestions" component={ViewUserQuestions}/>
                <Route path="/final" component={null}/>
                <Route path="/playOnline" component={OnlineRoom}/>
            </Switch>
        </React.Fragment>
    )
}