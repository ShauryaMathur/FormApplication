import React, {Component} from 'react';
import {Table,Button} from 'reactstrap';
import {connect} from 'react-redux';
import {getRequestedFormsSocket, approveForm, rejectForm} from '../actions/formactions';
import PropTypes from 'prop-types';
import io from 'socket.io-client';


class RequestedForms extends Component {


    state = {
        socket: io.connect("http://localhost:5000"),
        requestedForms: []
    }

    static propTypes = {
        getRequestedFormsSocket : PropTypes.func.isRequired,
        approveForm:PropTypes.func.isRequired,
        rejectForm:PropTypes.func.isRequired,    
        isAuthenticated: PropTypes.bool
    };


    componentDidMount() {
        const newObj = {
            department: this.props.department,
            targetUser: this.props.email
        }
        console.log(newObj)
        this.props.getRequestedFormsSocket(this.state.socket, newObj);

        this.state.socket.on('requestedFormsFetched', (data) => {
            this.setState({requestedForms: data})
            console.log(data)
        })

        this.state.socket.on('formApproved', (form) => {
            this.props.getRequestedFormsSocket(this.state.socket, newObj);
        })

        this.state.socket.on('formRejected', (form) => {
            this.props.getRequestedFormsSocket(this.state.socket, newObj);
        })

    };

    onApprove = (id) => {
        this.props.approveForm(this.state.socket, id);
    };

    onReject = (id) => {
        this.props.rejectForm(this.state.socket, id);
    };


    render() {
        return (<React.Fragment>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Created By</th>
                        <th>Department</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{
                    this.state.requestedForms.map(({_id,createdBy,departmentName,message,status}, index) => (
                    <tr>
                        <td>{index + 1}</td>
                        <td>{createdBy}</td>
                        <td>{departmentName}</td>
                        <td>{message}</td>
                        <td>{status}</td>
                        <td>
                            <Button onClick={
                                    this.onApprove.bind(this, _id)
                                }
                                color="success">
                                Approve
                            </Button>
                            <Button onClick={
                                    this.onReject.bind(this, _id)
                                }
                                color="danger">
                                Reject
                            </Button>
                        </td>
                    </tr>))
                }</tbody>
            </Table>
        </React.Fragment>

        );
    }
}

const mapStateToProps = state => ({email: state.auth.email, department: state.auth.department, isAuthenticated: state.auth.isAuthenticated});

export default connect(mapStateToProps, {getRequestedFormsSocket, approveForm, rejectForm})(RequestedForms);
