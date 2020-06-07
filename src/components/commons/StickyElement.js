import React from 'react';

export class StickyElement extends React.Component{

    componentDidMount(){
        var elem = document.getElementById(this.props.id)
        var elemTop = elem.offsetTop;
        var elemBottom = elemTop + elem.offsetHeight;
        elem.style.transition = 'all 1s';

        document.addEventListener('scroll',(event) => {
            var docViewTop = document.documentElement.scrollTop  ||  window.pageYOffset;
            var docViewBottom = docViewTop + window.innerHeight;

            const activeSticky = ((elemBottom-docViewTop <= docViewBottom) && (elemTop >= docViewTop - 100)) ;
            if(!activeSticky && docViewTop > 100){
                if(elem.style.position !== 'fixed'){
                    elem.style.position = 'fixed';
                    elem.style.top = '-50px';
                    elem.style.zIndex = '1000';
                    elem.style.transform = 'translateY(100px)';
                }
            } else {
                if(elem.style.position !== 'relative')
                    elem.style.position = 'relative';
                    elem.style.top = '0px';
                    elem.style.transform = 'translateY(0px)';

            }
    
        })

    }
    render(){
        return(
            <div id={this.props.id} style={this.props.style}>
                {this.props.children}
            </div>
        )
    }
} 

