import React,{Component} from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { Button, Form, FormGroup, Label, Input, Col , FormFeedback} from 'reactstrap';
import { Link } from 'react-router-dom';
import Axios from 'axios';

class PostBlog extends Component{
    constructor(props){
        super(props);
        this.state = {
            blogname: '',
            category: '',
            blog: '',
            touched:{
                blogname: false,
                category: false
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {
        // console.log('Current State is: ' + JSON.stringify(this.state));
        // alert('Current State is: ' + JSON.stringify(this.state));
        const data={
            name:this.state.blogname,
            description: this.state.blog,
            category: this.state.category
        }
        const bearer = 'Bearer ' + localStorage.getItem('token');
        console.log(data);
        console.log(bearer);
        Axios.post('http://localhost:3444/blogs',data,{
            headers:{
                'authorization': bearer,
                'Content-Type': 'application/json'
            }
        })
        .then(resp=>console.log(resp))
        .catch(err=>console.log(err));
        event.preventDefault();
    }

    handleBlur = (field)=> (evt)=> {
        this.setState({
            touched: {...this.state.touched, [field] : true }
        });
    }
    validate(blogname,category){
        const errors ={
            blogname: '',
            category: ''
        };
        if (this.state.touched.blogname && blogname.length<3)
            errors.blogname = 'blogname should be >=3 characters';
        else if(this.state.touched.blogname && blogname.length>20)
            errors.blogname = 'First Name should be <=10 characters';

        
        if( this.state.touched.category&&category=='')
            errors.category = 'this field can not be empty';
        
            return errors;
            
    }
    
    render(){
        const errors= this.validate(this.state.blogname,this.state.lastname,this.state.telnum,this.state.email);

        return (
            <div>
                <Header/>
                <div className="row row-content">
                <div className="col-12">
                   <h3>Send us your Feedback</h3>
                </div>
                 <div className="col-12 col-md-9">
                     <Form onSubmit={this.handleSubmit}>
                     <FormGroup row>
                             <Label htmlFor="blogname" md={2}>First Name</Label>
                             <Col md={10}>
                                 <Input type="text" id="blogname" name="blogname"
                                     placeholder="First Name"
                                     value={this.state.blogname}
                                     valid={errors.blogname === ''}
                                     invalid={errors.blogname !== ''}
                                     onBlur={this.handleBlur('blogname')}
                                     onChange={this.handleInputChange} />
                                 <FormFeedback>{errors.blogname}</FormFeedback>
                             </Col>
                         </FormGroup>
                         
                         
                         <FormGroup row>
                             
                             <Col md={{size: 3, offset: 1}}>
                                 <Input type="select" name="category"
                                         value={this.state.category}
                                         onChange={this.handleInputChange}
                                         valid={errors.category === ''}
                                     invalid={errors.category !== ''}
                                     onBlur={this.handleBlur('category')}
                                     onChange={this.handleInputChange} >
                                     <option> </option>
                                     <option>a</option>
                                     <option>b</option>
                                     <option>c</option>
                                     <option>d</option>
                                     <option>e</option>
                                     <option>f</option>
                                 </Input>
                             </Col>
                         </FormGroup>
                         <FormGroup row>
                             <Label htmlFor="blog" md={2}>Your blog</Label>
                             <Col md={10}>
                                 <Input type="textarea" id="blog" name="blog"
                                     rows="20"
                                     value={this.state.blog}
                                     onChange={this.handleInputChange}></Input>
                             </Col>
                         </FormGroup>
                         <FormGroup row>
                             <Col md={{size: 10, offset: 2}}>
                                 <Button type="submit" color="primary">
                                     Send Feedback
                                 </Button>
                             </Col>
                         </FormGroup>
                     </Form>
                 </div>
            </div>
                <Footer/>
            </div>
            

        )
    }
}

export default PostBlog;