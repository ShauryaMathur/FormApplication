import React, {Component} from 'react';
import {Table} from 'reactstrap';
import {connect} from 'react-redux';
import {getApprovedFormsSocket} from '../actions/formactions';
import PropTypes from 'prop-types';

class ApprovedForms extends Component {


    state = {
        approvedForms :[]
    }

    static propTypes = {
        getApprovedFormsSocket : PropTypes.func.isRequired,
    };

    componentDidMount() {
        const newObj = {
            department: this.props.department,
            targetUser: this.props.email
        }

        this.props.getApprovedFormsSocket(this.props.socket,newObj);

        this.props.socket.on('approvedFormsFetched',(data)=>{
            this.setState({approvedForms:data})
        })
    };

    render() {

        const {isAuthenticated} = this.props;

        const approvedFormsList = (
            <Table> 
                <thead> 
                <tr> 
                    <th> # </th>
                    <th>Created By</th>
                    <th> Department </th>
                    <th>Message</th>
                    <th> Status </th>
                </tr> 
                </thead> 
                <tbody>{
                this.state.approvedForms.map(
                ({_id,createdBy,departmentName,message,status}, index) => (
                    <tr key={_id}>
                        <td>{index + 1}</td>
                        <td>{createdBy}</td>
                        <td>{departmentName}</td>
                        <td>{message}</td>
                        <td>{status}</td>
                    </tr>))
                }</tbody>
            </Table > 
        )
        return(
        < React.Fragment> 
            {isAuthenticated?approvedFormsList:<p>Please Login To Continue</p>}
        </React.Fragment>)}}


const mapStateToProps = state => ({socket:state.auth.socket,email: state.auth.email,department: state.auth.department,isAuthenticated: state.auth.isAuthenticated});


export default connect(mapStateToProps, {getApprovedFormsSocket})(ApprovedForms);
