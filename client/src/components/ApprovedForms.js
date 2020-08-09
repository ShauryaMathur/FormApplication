import React, {Component} from 'react';
import {Table} from 'reactstrap';
import {connect} from 'react-redux';
import {getApprovedFormsSocket} from '../actions/formactions';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

class ApprovedForms extends Component {


    state = {
        approvedForms :[],
        socket:io.connect("http://localhost:5000")
    }

    static propTypes = {
        getApprovedFormsSocket : PropTypes.func.isRequired,
    };

   
    componentDidMount() {
        const newObj = {
            department: this.props.department,
            targetUser: this.props.email
        }

        this.props.getApprovedFormsSocket(this.state.socket,newObj);

        this.state.socket.on('approvedFormsFetched',(data)=>{
            this.setState({approvedForms:data})
        })
    };

    onDelete = (id) => {
        this.props.deleteItem(id);
    };

    render() {
        return(
        < React.Fragment> 
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
        </React.Fragment>)}}


const mapStateToProps = state => ({email: state.auth.email,department: state.auth.department,item: state.item,isAuthenticated: state.auth.isAuthenticated});


export default connect(mapStateToProps, {getApprovedFormsSocket})(ApprovedForms);
