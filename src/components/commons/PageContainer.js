import React from 'react';
export const PageContainer = ({history,children,id}) => {
    return (
        <div className="st-pusher" style={{marginTop: '75px'}}>
            <div className="st-content">
                <div className="st-content-inner" id={id}>
                        <div className="container-fluid">
                            {children}
                        </div>
                </div>
            </div>
        </div>
    )
}