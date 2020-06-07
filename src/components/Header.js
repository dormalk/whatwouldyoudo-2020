import React from 'react';
import {Link} from 'react-router-dom';
import {logout,loginWithGoogleProvider} from '../actions/auth';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

export const Header = () => {
    return (
        <div className="navbar navbar-main navbar-default navbar-fixed-top" role="navigation">
            <div className="container-fluid" style={{margin: "0px"}}>
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-nav">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link className="navbar-brand" to="/">WHAT WHOULD YOU DO</Link>
                </div>
                <div className="collapse navbar-collapse" id="main-nav">
                <ProfileDropDown/>
              </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    userdata: state.auth.user,
    isLogin: state.auth.user != null
})


const mapDisptachToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
})

const ProfileDropDown = withRouter(connect(mapStateToProps,mapDisptachToProps)
(({isLogin,userdata,logout,history}) => {
    return (
    <ul className="nav navbar-nav navbar-right "  style={{padding: '0px'}}>
        <li className="dropdown user">
            {
                isLogin? (
                    <React.Fragment>
                        <a  style={{lineHeight: 0}} className="dropdown-toggle" data-toggle="dropdown">
                            <img src={userdata.photoURL} alt="" className="img-circle" /> {userdata.displayName}<span className="caret"></span>
                        </a>
                        <ul className="dropdown-menu" role="menu">
                        <li><a>פרופיל <i className="fa fa-user"></i></a></li>
                        <li><a>הגדרות <i className="fa fa-wrench"></i></a></li>
                        <li onClick={() => history.push('/userquestions')}><a>הסיטואציות שלי <i className="fa  fa-question"></i></a></li>
                        <li onClick={() => {logout()}}><a>התנתקות <i className="fa fa-sign-out"></i></a></li>
                        </ul>
                    </React.Fragment>    
                ):
                <div className="sign-btn" onClick={()=>loginWithGoogleProvider()} style={{margin:'0px',padding: '15px', cursor: 'pointer'}}>Sign In <i className="fa fa-google"></i></div>
            }
        </li>
    </ul>

    )
}))

