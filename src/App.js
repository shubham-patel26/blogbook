import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap-social/bootstrap-social.css';
import './App.css';

import { Route,Switch,Redirect,BrowserRouter } from 'react-router-dom';
import Main1 from './components/MainComponent1';
import Main2 from './components/MainComponent2';
import PostBlog from './components/PostBlogComponent';

class App extends React.Component {
  constructor(props){
    super(props);
    
  }
  render(){
    
    return (
      <BrowserRouter>
          <div className="App">
            <Switch >
              <Route path='/home' component={()=> <Main1 props={this.props}/>}/>
              <Route path='/blogs' component={()=> <Main2 props={this.props}/>}/>
              <Route path='/postblog' component={()=><PostBlog props={this.props}/>}/>
              <Redirect to="/home"/>
            </Switch>
            
            </div>
      </BrowserRouter>
      
    );
  }
  
}

export default App;
