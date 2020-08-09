import React, {Component} from 'react';
import {Table,} from 'reactstrap';
import {connect} from 'react-redux';
import {getRejectedFormsSocket} from '../actions/formactions';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

class RejectedForms extends Component {

    state = {
        rejectedForms: [],
        socket:io.connect("http://localhost:5000")
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
