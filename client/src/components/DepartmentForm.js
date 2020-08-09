import React, {Component} from 'react';
import {
    Button,
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
import {register, getAllUsersSocket, getAllDepartmentsSocket} from '../actions/authactions';
import {addFormSocket} from '../actions/formactions';

class DepartmentForm extends Component {

    state = {
        createdBy: '',
        departmentName: '',
        targetUser: '',
        message: '',
        dropdownOpen: false,
        departmentUsersDropdownOpen: false,
        availableDepartments: [],
        users: []
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        register: PropTypes.func.isRequired
    };

    componentDidMount(prevProps) {

        this.props.getAllDepartmentsSocket(this.props.socket)

        this.props.getAllUsersSocket(this.props.socket);

        this.props.socket.on('allUsersFetched', (res) => {
            this.setState({users: res});

        })
        this.props.socket.on('formAdded', (res) => {
            console.log('Done');
        })

        this.props.socket.on('allDepartmentsFetched', (departments) => {
            this.setState({availableDepartments: departments})

        })
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState !== this.state) {
            this.props.getAllDepartmentsSocket(this.props.socket)

            this.props.getAllUsersSocket(this.props.socket);

        }

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
        this.props.addFormSocket(this.props.socket, newFormRequest);
        this.setState({createdBy: '', departmentName: '', targetUser: '', message: ''})

    }

    render() {

        const form = (
            <Form onSubmit={
                this.onSubmit
            }>
                <FormGroup>
                    <Label for="createdBy">Created By</Label>
                    <Input type="text" name="createdBy" id="createdBy" placeholder="Name" className="mb-3"
                        value={
                            this.state.createdBy
                        }
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
                            this.state.availableDepartments.map((value) => (<DropdownItem key={value}
                                disabled={
                                    value === this.props.department
                                }
                                value={value}
                                onClick={
                                    this.handleDepartmentSelect
                            }> {value}</DropdownItem>))
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
                    <Input type="text" name="message" id="message" placeholder="Message" className="mb-3"
                        value={
                            this.state.message
                        }
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
        )
        return (<React.Fragment>
            {this.props.isAuthenticated?form:<p>Please Login To Continue</p>}
        </React.Fragment>);
    }

}

const mapStateToProps = state => ({socket:state.auth.socket,department: state.auth.department, isAuthenticated: state.auth.isAuthenticated});
export default connect(mapStateToProps, {
    register,
    addFormSocket,
    getAllUsersSocket,
    getAllDepartmentsSocket
})(DepartmentForm);
