import React, {Component} from 'react';
import {
    Table,
    Container,
    ListGroup,
    ListGroupItem,
    Button,
    NavLink,
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {connect} from 'react-redux';
import {getRejectedFormsSocket} from '../actions/formactions';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

class RejectedForms extends Component {

    state = {
        socket: io.connect("http://localhost:5000"),
        rejectedForms: []

    }

    static propTypes = {
        getRejectedFormsSocket : PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };


    componentDidMount() {
        const newObj = {
            department: this.props.department,
            targetUser: this.props.email
        }

        this.props.getRejectedFormsSocket(this.state.socket, newObj);

        this.state.socket.on('rejectedFormsFetched', (data) => {
            this.setState({rejectedForms: data})
        })
    };

render() {
    return(
    <React.Fragment> 
        <Table> 
            <thead>
                <tr>
                    <th>#</th>
                    <th>Created By</th>
                    <th>Department</th>
                    <th>Message</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>{
        this.state.rejectedForms.map(
    ({_id,createdBy,departmentName,message,status}, index) => (
    <tr key={_id}>
        <td>{index + 1}</td>
        <td>{createdBy}</td>
        <td>{departmentName}</td>
        <td>{message}</td>
        <td>{status}</td>
    </tr>)
)}</tbody></Table > </React.Fragment>)}}
const mapStateToProps = state => ({email: state.auth.email, department: state.auth.department, item: state.item, isAuthenticated: state.auth.isAuthenticated});
export default connect(mapStateToProps, {getRejectedFormsSocket})(RejectedForms);
