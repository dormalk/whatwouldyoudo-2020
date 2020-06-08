import React from 'react';
import { Link } from 'react-router-dom';
import { shareFacebook } from '../configs/functions';
import {withRouter} from 'react-router-dom';
import {Loader, PageContainer} from './commons';

export const Main = withRouter(({history}) => {
    return(
        <PageContainer id="main">
            <div className="pull-right">
                <a className="primary" onClick={() => shareFacebook()}>
                    שתפו בפייסבוק
                </a>
            </div>
            <br/>

            <h4 className="page-section-heading">מה אתם הייתם עושים?!</h4>
            <div className="panel panel-default" style={{padding: "15px"}}>
                <div className="form-group" style={{margin: "15px"}}>
                    <center>                                
                        <b>"מה אתם הייתם עושים?"</b> - משחק המציב אתכם בדילמה כיצד הייתם נוהגים בסיטואציות אמיתיות <br/>
                        ו<i>כמו בחיים האמיתיים</i>, גם כאן אתם מוגבלים ביכולת שלכם להגיב לסיטואציה וברשותכם רק חמישה דרכי פעולה שונות<br/>
                        לא כולם יתאימו, לא כולם ישקפו את דעתכם האמיתית, אך שוב... <i>כמו בחיים האמיתיים</i> לא תמיד תקבלו מה שתירצו ותצרכו להגיב בכל זאת<br/>
                        האם תבחרו לפעול באופן לא שיגרתי? או שתעדיפו להיות הרעים? <br/>
                        בסיום כל סיטואציה תוכלו לגלות כמה חשבו כמוכם וכמה בחרו בפעולה שונה משלכם<br/>
                    </center>

                </div>
                <center>
                <React.Fragment>
                    <button className="btn btn-primary" style={{color: 'white',margin: '0.5rem'}}  onClick={() => history.push('rungame')}>אני רוצה להתחיל</button>
                    <button className="btn btn-teal-500" style={{color: 'white',margin: '0.5rem'}}  onClick={() => history.push('playonline')}>משחק אונליין</button>
                    <button className="btn btn-indigo-500" style={{color: 'white',margin: '0.5rem'}} onClick={() => history.push('alldata')}>אני רוצה לצפות בכל הנתונים</button>
                </React.Fragment>
                </center>
            </div>
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
