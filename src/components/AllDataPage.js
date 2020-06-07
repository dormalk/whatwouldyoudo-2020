import React from 'react';
import {PageContainer, DefaultPanel, Loader, StickyElement} from './commons';
import { initializedFirebaseApp } from '../configs/firebase';
import { convertToArr } from '../configs/functions';
import { withRouter } from 'react-router-dom';

export const AllDataPage = withRouter(({history}) => {
    const [questions, setQuestions] = React.useState([]);
    const [load, setLoad] = React.useState(false);
    const [search, setSearch] = React.useState('');
    React.useEffect(() => {
        setLoad(true)
        initializedFirebaseApp.database().ref('questions')
        .once('value', snapshot => {
            setQuestions(convertToArr(snapshot.val()))
            setLoad(false)
        })
    },[])

    return (
        <PageContainer id="alldatavideo">
            <DefaultPanel title="בחרו סיטואציה מתוך הרשימה">
                {
                    !load && questions &&
                    <React.Fragment>
                    <StickyElement id="search">
                        <input type="text" className="form-control" name="search" placeholder="חיפוש סיטואציה" onChange={(event) => setSearch(event.target.value)}/>
                    </StickyElement>
                    <hr/>
                    {

                        questions
                        .map((question,index) => {
                            return question.q.indexOf(search) >= 0?
                            (
                                <div key={index} className="panel panel-default ans" onClick={() => {history.push('question/'+question.id)}}>
                                    {(index+1)}. {question.q}
                                </div>
                            ): null;
                        })
                    }
                    </React.Fragment>

                }
                {
                    load && <Loader/>
                }
            </DefaultPanel>
        </PageContainer>
    )
})