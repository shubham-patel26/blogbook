import React, {Component} from 'react';
import Header from './HeaderComponent.js';
import Footer from './FooterComponent';
import Home from './HomeComponent';


class Main1 extends Component{
    constructor(props){
        super(props)
        
    }

    
    render(){
        const {prop}= this.props;
        return(
            <div>
                <Header props={this.prop}/>
                <Home props={this.prop}/>
                <Footer/>
                
                
            </div>
            
           )
    }
}

export default Main1;