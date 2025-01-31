import React, { Component } from 'react';
import {Alert,NavLink,Button,Modal,ModalHeader,ModalBody,Form,FormGroup,Label,Input} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import  {register} from '../../actions/authactions';

class RegisterModal extends Component{
    state={
        modal:false,
        name:'',
        email:'',
        password:'',
        department:'',
        msg:null
    };

    static propTypes={
        isAuthenticated:PropTypes.bool,
        register:PropTypes.func.isRequired
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

        const {name,email,password,department} = this.state;

        //Create User Object
        const newUser={
            name,email,password,department
        };

        //Attempt to register
        this.props.register(newUser);

    }

    render(){
        return(
            <div>
                <NavLink onClick={this.toggle} href="#">Register</NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Register</ModalHeader>
                    <ModalBody>
                        {this.state.msg?<Alert color="danger">{this.state.msg}</Alert>:null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input type="text" name="name" id="name" placeholder="Name" className="mb-3" onChange={this.onChange}/>
                                <Label for="email">E-Mail</Label>
                                <Input type="text" name="email" id="email" placeholder="E-Mail" className="mb-3" onChange={this.onChange}/>
                                <Label for="department">Department</Label>
                                <Input type="text" name="department" id="department" placeholder="Department Name" className="mb-3" onChange={this.onChange}/>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" id="password" placeholder="Password" className="mb-3" onChange={this.onChange}/>
                                <Button color="dark" style={{marginTop:'2rem'}} block >Register</Button>
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
export default connect(mapStateToProps,{register})(RegisterModal);