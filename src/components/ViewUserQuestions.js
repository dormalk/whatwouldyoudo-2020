import React from 'react';
import { initializedFirebaseApp } from '../configs/firebase';
import {PageContainer,Loader,DefaultPanel,StickyElement} from './commons';
import  {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

const mapStateToProps = ({auth}) => ({
    relatedQuestions: auth.data && auth.data.relatedQuestions? auth.data.relatedQuestions : [],
})

export const ViewUserQuestions = withRouter(connect(mapStateToProps)
(({relatedQuestions,history}) => {
    const [questions, setQuestions] = React.useState([]);
    const [load, setLoad] = React.useState(false);
    const [search, setSearch] = React.useState('');
    React.useEffect(() => {
        setLoad(true)
        let reads = [];
        const ref = initializedFirebaseApp.database().ref('questions');
        relatedQuestions.forEach(questionId => {
            var promise = ref.child(questionId).once('value')
            .then((snap) => ({...snap.val(), id: snap.key}), (err) => console.error(err))
            reads.push(promise);
        })
        Promise.all(reads)
        .then((data) => {
            setQuestions(data)
            setLoad(false)
        })
    },[relatedQuestions])

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
}))
