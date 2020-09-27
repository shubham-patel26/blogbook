import React ,{Component} from 'react';
import { Media } from 'reactstrap';
import {Link} from 'react-router-dom';
class DisplayContent extends Component{
    constructor(props){
        super(props);
    }
    render(){
         
        
    
        return(
            
            <React.Fragment>
            {
                
                this.props.blogs.map(blog=>{
                    console.log(this.props.category);
                return (
                    <div className="media" key={blog._id} >
                        <Link to = {`../blogs/${this.props.category}/${blog._id}`}>
                        <div className="media-body">
                            <h5 className="mt-0">{blog.name}</h5>
                            {blog.author.username}
                        </div>
                        </Link>
                 </div>
                )
                })
            }
        
        
        </React.Fragment>
                
            
            
        )
    }
}
export default DisplayContent;