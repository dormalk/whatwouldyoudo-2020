import React from 'react';

export const DefaultPanel = ({children, style, title,phase}) => {
    return(
        <div className="panel panel-default" style={{...style, padding:"15px"}}>
            {title && <div className="panel-heading">
                <center>
                    <h4>{title}</h4>
                    {
                        phase &&
                        <div className="row phase">
                            <span className={`${phase >= 1? 'active' : ''}`}>1</span>
                            <span className={`${phase >= 2? 'active' : ''}`}>2</span>
                            <span className={`${phase >= 3? 'active' : ''}`}>3</span>
                            <span className={`${phase >= 4? 'active' : ''}`}>4</span>
                        </div>
                    }
                </center>

            </div>}
            <div className="panel-body" style={{position: 'relative'}}>
            {children}
            </div>
        </div>
    )
}