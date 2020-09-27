import React , {Component} from 'react';
import Sidebar from './SidebarComponent';
import Footer from './FooterComponent';
import DisplayContent from './DisplayContentComponent';
import DisplayBlog from './DisplayBlogComponent';
import {Switch,Route,Redirect,Link} from 'react-router-dom';

import {CATLIST} from '../data/CATLIST';
import {BLOGS}  from '../data/BLOGS';
import Axios from 'axios';

class Main2 extends Component{
    constructor(props){
        super(props);
        
        this.state={
            catList: [],
            blogs:[],
            
        }
    }

   async componentDidMount(){
       
        var blogs=await  Axios.get('http://localhost:3444/blogs');
        console.log(blogs);
        var data=blogs.data.map(blog=> blog.category);
        var catList = [...new Set(data)];
        catList.push('all');
        this.setState({
            blogs: blogs.data,
            catList:catList
        })
        //  console.log(this.state.catList);
        
    }
    
    
    render(){

        const conditionalRend=(match)=>{
            
            return (
                match.params.category==='all'?<DisplayContent 
                blogs={this.state.blogs}
                category={match.params.category}
                />
            :
            
               
                <DisplayContent 
                blogs={this.state.blogs.filter((blog)=> blog.category===match.params.category)}
                category={match.params.category}
                />
            )
        }
        const BlogWithCategory= ({match})=>{
            
            return ( conditionalRend(match));
        }
        const BlogWithId= ({match})=>{
            // alert(match.params.blogid);
            return (
                
                <DisplayBlog 
                blog={this.state.blogs.filter((blog)=> blog._id===match.params.blogid)[0]}
                
                />
            )
        }
        
        return (
                <div className="container">
            <div className="row">
                <div className="col-md-3 ">
                    <div className=''>
                        <ul className='list-unstyled'>
                            <li><Link to = '/home'> Home </Link></li>
                            <li><Link to = '/postblog'> Post a Blog </Link></li>
                        </ul>
                    </div>
                    <h4>categories</h4>
                    <Sidebar catList={this.state.catList}/>
                </div>
            
                <div className="col-md blog">
                    
                    <Switch>
                        <Route exact path='/blogs' component= {()=> <DisplayContent category='all' blogs={this.state.blogs}/>}/>
                        <Route exact path='/blogs/:category' component={BlogWithCategory} />
                        <Route exact path='/blogs/:category/:blogid' component={BlogWithId}/>
                    </Switch>
                    
                </div>

            </div>
            <div>
                <Footer/>
            </div>
        </div>
        )
    }
}
export default Main2;