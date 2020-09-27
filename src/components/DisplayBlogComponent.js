import React ,{Component} from 'react';
import { Media } from 'reactstrap';
function DisplayBlog(props){
    console.log(props.blog);
        return(
            <div className="media" >
                
                <div className="media-body">
                    <h5 className="mt-0">{props.blog.name}</h5>
                    {props.blog.description}
                </div>
                
            </div>
        )
    }

export default DisplayBlog;