import React, {Component} from 'react';
import {Table} from 'reactstrap';
import {connect} from 'react-redux';
import {getDepartmentPendingFormsSocket} from '../actions/formactions';
import PropTypes from 'prop-types';

class PendingForms extends Component {

    state = {
        departmentPendingForms: []
    }

    static propTypes = {
        getDepartmentPendingFormsSocket : PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };

    componentDidUpdate(prevProps) {
        const {department} = this.props;

        const newObj = {
            departmentName: department
        }
        if (prevProps.department !== this.props.department) {
            this.props.getDepartmentPendingFormsSocket(this.props.socket, newObj);
        }
    }

    componentDidMount() {
        const {department} = this.props;
        console.log(department)
        const newObj = {
            departmentName: department
        }
        this.props.getDepartmentPendingFormsSocket(this.props.socket, newObj);
        this.props.socket.on('departmentFormsFetched', (forms) => {
            this.setState({departmentPendingForms: forms})
        })

    };

    onDelete = (id) => {
        this.props.deleteItem(id);
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
                    </tr>
                </thead>
                <tbody>{
                    this.state.departmentPendingForms.map(({_id,
                        createdBy,
                        departmentName,
                        message,
                        status
                    }, index) => (<tr key={_id}>
                        <td>{index + 1}</td>
                        <td>{createdBy}</td>
                        <td>{departmentName}</td>
                        <td>{message}</td>
                        <td>{status}</td>
                    </tr>))
                }</tbody>
            </Table>
        </React.Fragment>

        );
    }
}

const mapStateToProps = state => ({socket:state.auth.socket,department: state.auth.department, item: state.item, isAuthenticated: state.auth.isAuthenticated});


export default connect(mapStateToProps, {getDepartmentPendingFormsSocket})(PendingForms);
