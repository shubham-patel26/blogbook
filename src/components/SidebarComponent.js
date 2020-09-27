import React,{Component} from 'react'
import { CardText } from 'reactstrap';
import {Link} from 'react-router-dom';

const Sidebar=(props)=>{

        console.log(props.catList);
        return(
            <div className='sidebar'>
                <ul>{
                    props.catList.map(cate=>{
                        return(
                        <li className='list-unstyled' key={cate}><Link to={`/blogs/${cate}`}>{cate}</Link></li>
                        )
                    })
                    }
                
                
                </ul>
                
            </div>
        )
 }

export default Sidebar;