import React,{Component,useState} from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label } from 'reactstrap';
import {NavLink} from 'react-router-dom'
import Axios from 'axios';


class Header extends Component {
    constructor(props) {
        super(props);
    
        this.toggleNav = this.toggleNav.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
          isNavOpen: false,
          isModalOpen: false
        };
      }

      toggleNav() {
        this.setState({
          isNavOpen: !this.state.isNavOpen
        });
      }
      toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
      }
      handleLogin(event) {
        this.toggleModal();
        const user={
            username:this.username.value,
            password:this.password.value
        }
         Axios({
            method: 'post',
            url: 'http://localhost:3444/users/login',
            data: user,
            headers: {
                'Content-Type': 'application/json'
                }
          })
          .then(resp=>{
            // console.log(resp);
            const {token}=resp.data;
            localStorage.setItem('token',token);
          })
          .catch(err=>{
              console.log(err);
          })
          
       event.preventDefault();

    }
      
    render() {
        

return (
    <React.Fragment>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                    <ModalBody>
                    <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                    innerRef={(input) => this.username = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                    innerRef={(input) => this.password = input}  />
                            </FormGroup>
                            
                            <Button type="submit" value="submit" color="primary">Login</Button>
                        </Form>
                    </ModalBody>
                </Modal>
        <div className='container'>
            <Navbar color="light" light expand="md">
            <NavbarBrand href="/">BlogBook</NavbarBrand>
            <NavbarToggler onClick={this.toggleNav} />
            <Collapse isOpen={this.state.isNavOpen} navbar>
                <Nav className="mr-auto" navbar>
                <NavItem>
                    <NavLink className="nav-link"  to='/home'><span className="fa fa-home fa-lg"></span> Home</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link"  to='/blogs'><span className="fa fa-list fa-lg"></span> Blogs</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to='/postblog'><span className="fa fa-info fa-lg"></span> Post a Blog</NavLink>
                </NavItem>
                </Nav>
                
            </Collapse>
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <Button outline onClick={this.toggleModal}><span className="fa fa-sign-in fa-lg"></span> Login</Button>
                </NavItem>
            </Nav>
            </Navbar>
        </div>

                <Jumbotron>
                    <div className="container">
                        <div className="row row-header">
                            <div className="col-12 col-sm-6">
                                <h1>BLOGBOOK</h1>
                                <p>the world of blogs</p>
                            </div>
                        </div>
                    </div>
                </Jumbotron>
    </React.Fragment>
        


                
               
            
        );
    }
}
export default Header;




