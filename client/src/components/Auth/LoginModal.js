import React, { Component } from 'react';
import {Alert,NavLink,Button,Modal,ModalHeader,ModalBody,Form,FormGroup,Label,Input} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import  {login} from '../../actions/authactions';

class LoginModal extends Component{
    state={
        modal:false,
        email:'',
        password:'',
        msg:null
    };

    static propTypes={
        isAuthenticated:PropTypes.bool,
        login:PropTypes.func.isRequired
    };

    componentDidUpdate(prevProps){
       const {isAuthenticated}=this.props ;
      
       //If Authenticated close Modal
       if(this.state.modal){
           if(isAuthenticated){
               this.toggle();
           }
       }
    }

    toggle=()=>{
        this.setState({
            modal:!this.state.modal
        });
    }

    onChange=(e)=>{
        this.setState({[e.target.name]:e.target.value});
    }

    onSubmit=e=>{
        e.preventDefault();
        const {email,password}=this.state;

        const user={
            email,password
        };
        
        //Attempt to login
        this.props.login(user);

    }

    render(){
        return(
            <div>
                <NavLink onClick={this.toggle} href="#">Login</NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Login</ModalHeader>
                    <ModalBody>
                        {this.state.msg?<Alert color="danger">{this.state.msg}</Alert>:null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="email">E-Mail</Label>
                                <Input type="text" name="email" id="email" placeholder="E-Mail" className="mb-3" onChange={this.onChange}/>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" id="password" placeholder="Password" className="mb-3" onChange={this.onChange}/>
                                <Button color="dark" style={{marginTop:'2rem'}} block >Login</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

}

const mapStateToProps=state=>({
    isAuthenticated:state.auth.isAuthenticated
});
export default connect(mapStateToProps,{login})(LoginModal);