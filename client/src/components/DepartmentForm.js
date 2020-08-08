import React, {Component} from 'react';
import {
    Alert,
    NavLink,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {register} from '../actions/authactions';
import {addFormSocket, FormAdded} from '../actions/formactions';

import {clearErrors} from '../actions/erroractions';
import io from 'socket.io-client';

class DepartmentForm extends Component {

    state = {
        socket : io.connect("http://localhost:5000"),
        createdBy: '',
        departmentName: '',
        targetUser: '',
        message: '',
        dropdownOpen: false,
        departmentUsersDropdownOpen: false,
        availableDepartments: [
            {
                _id: 1,
                value: 'D1',
                label: 'Department1'
            }, {
                _id: 2,
                value: 'D2',
                label: 'Department2'
            }, {
                _id: 3,
                value: 'EG-DEV',
                label: 'Department3'
            }
        ],
        users: [
            {
                _id: 1,
                name: 'Shaurya',
                department: 'D1'
            }, {
                _id: 2,
                name: 'Karan',
                department: 'D2'
            }
        ]
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };

    componentDidMount(prevProps) {
        this.state.socket.on('formAdded', (res) => {
            this.props.FormAdded(res);
            console.log('Form Added');

        })

    }

    componentDidUpdate(prevProps) {
        const {error, isAuthenticated, department} = this.props;
        if (error != prevProps.error) { // Check for register error
            if (error.id == 'REGISTER_FAIL') {
                this.setState({msg: error.msg.msg});
            } else {
                this.setState({msg: null});
            }
        }

        // If Authenticated close Modal
        //    if(this.state.modal){
        //        if(isAuthenticated){
        //            this.toggle();
        //        }
        //    }
    }


    toggleDepartmentDropdown = () => {
        this.setState({
            departmentDropdownOpen: !this.state.departmentDropdownOpen
        });
    }

    toggleDepartmentUsersDropdown = () => {
        this.setState({
            departmentUsersDropdownOpen: !this.state.departmentUsersDropdownOpen
        });
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    handleDepartmentSelect = (e) => {
        this.setState({departmentName: e.target.value})
    }

    handleUserSelect = (e) => {
        this.setState({targetUser: e.target.value})
    }


    onSubmit = e => {
        e.preventDefault();

        const {createdBy, departmentName, targetUser, message} = this.state;

        // Create User Object
        const newFormRequest = {
            createdBy,
            departmentName,
            targetUser,
            message
        };

        // Attempt to register
        // this.props.register(newUser);
        this.props.addFormSocket(this.state.socket, newFormRequest);
        this.setState({createdBy :'', departmentName:'',targetUser:'', message:''})

    }

    render() {
        return (<React.Fragment>
            <Form onSubmit={
                this.onSubmit
            }>
                <FormGroup>
                    <Label for="createdBy">Created By</Label>
                    <Input type="text" name="createdBy" id="createdBy" placeholder="Name" className="mb-3" value={this.state.createdBy}
                        onChange={
                            this.onChange
                        }/>
                    <Label for="email">Department</Label>
                    <Dropdown value={
                            this.state.departmentName
                        }
                        onChange={
                            this.handleSelect
                        }
                        isOpen={

                            this.state.departmentDropdownOpen
                        }
                        toggle={
                            this.toggleDepartmentDropdown
                    }>
                        <DropdownToggle caret> {
                            this.state.departmentName === '' ? `Select Department` : this.state.departmentName
                        } </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>Departments</DropdownItem>
                            {
                            this.state.availableDepartments.map(({_id, value, label}) => (<DropdownItem key={_id}
                                disabled={
                                    value === this.props.department
                                }
                                value={value}
                                onClick={
                                    this.handleDepartmentSelect
                            }> {label}</DropdownItem>))
                        } </DropdownMenu>
                    </Dropdown>

                    <Label>User</Label>
                    <Dropdown name="targetUser" id="targetUser"
                        isOpen={
                            this.state.departmentUsersDropdownOpen
                        }
                        toggle={
                            this.toggleDepartmentUsersDropdown
                    }>
                        <DropdownToggle caret> {
                            this.state.targetUser === '' ? `Select User From Department` : this.state.targetUser
                        } </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>Users In The Department</DropdownItem>

                            {
                            this.state.users.filter(({department}) => {
                                return department === this.state.departmentName
                            }).map(({_id, name}) => (<DropdownItem key={_id}
                                value={name}
                                onClick={
                                    this.handleUserSelect
                            }> {name}</DropdownItem>))
                        } </DropdownMenu>
                    </Dropdown>

                    <Label for="message">Message</Label>
                    <Input type="text" name="message" id="message" placeholder="Message" className="mb-3" value={this.state.message}
                        onChange={
                            this.onChange
                        }/>

                    <Button color="dark"
                        style={
                            {marginTop: '2rem'}
                        }
                        block>Submit</Button>
                </FormGroup>
            </Form>
        </React.Fragment>);
    }

}

const mapStateToProps = state => ({department: state.auth.department, isAuthenticated: state.auth.isAuthenticated, error: state.error});
export default connect(mapStateToProps, {register, clearErrors, addFormSocket, FormAdded})(DepartmentForm);

