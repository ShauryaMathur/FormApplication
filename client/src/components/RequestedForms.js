import React, {Component} from 'react';
import {Table,Button} from 'reactstrap';
import {connect} from 'react-redux';
import {getRequestedFormsSocket, approveForm, rejectForm} from '../actions/formactions';
import PropTypes from 'prop-types';

class RequestedForms extends Component {


    state = {
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
        this.props.getRequestedFormsSocket(this.props.socket, newObj);

        this.props.socket.on('requestedFormsFetched', (data) => {
            this.setState({requestedForms: data})
        })

        this.props.socket.on('formApproved', (form) => {
            this.props.getRequestedFormsSocket(this.props.socket, newObj);
        })

        this.props.socket.on('formRejected', (form) => {
            this.props.getRequestedFormsSocket(this.props.socket, newObj);
        })

    };

    onApprove = (id) => {
        this.props.approveForm(this.props.socket, id);
    };

    onReject = (id) => {
        this.props.rejectForm(this.props.socket, id);
    };


    render() {

        const {isAuthenticated} = this.props;

        const requestedFormsList = (
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
                    <tr key={_id}>
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
        )
        return (<React.Fragment>
            {isAuthenticated?requestedFormsList:<p>Please Login To Continue</p>}
        </React.Fragment>

        );
    }
}

const mapStateToProps = state => ({socket:state.auth.socket,email: state.auth.email, department: state.auth.department, isAuthenticated: state.auth.isAuthenticated});

export default connect(mapStateToProps, {getRequestedFormsSocket, approveForm, rejectForm})(RequestedForms);
