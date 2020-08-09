import React, {Component} from 'react';
import {Alert} from 'reactstrap'
import {connect} from 'react-redux';
import io from 'socket.io-client';



class NotificationWindow extends Component {

    state = {
        notification: '',
        showNotification: false,
        socket:io.connect("http://localhost:5000")
    }

    componentDidMount() {

        this.state.socket.on('formAdded', (res) => {
            if (res.depatmentName === this.props.department) {
                this.setState({showNotification: true, notification: 'New Form Added !'})
                setTimeout(() => this.setState({showNotification: false}), 4000);
            }

        })
        this.state.socket.on('formApproved', (res) => {
            if (res.depatmentName === this.props.department) {
                this.setState({showNotification: true, notification: 'Form Approved !'})
                setTimeout(() => this.setState({showNotification: false}), 4000);
            }
        })
        this.state.socket.on('formRejected', (res) => {
            if (res.depatmentName === this.props.department) {
                this.setState({showNotification: true, notification: 'Form Rejected !'})
                setTimeout(() => this.setState({showNotification: false}), 4000);
            }
        })

    }

    render() {
        return (<Alert isOpen={
            this.state.showNotification
        }> {
            this.state.notification
        }</Alert>)
    }
}
const mapStateToProps = state => ({department: state.auth.department, isAuthenticated: state.auth.isAuthenticated});
export default connect(mapStateToProps, null)(NotificationWindow);
