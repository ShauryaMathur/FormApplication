import React, {Component} from 'react';
import {Alert} from 'reactstrap'
import {connect} from 'react-redux';


class NotificationWindow extends Component {

    state = {
        notification: '',
        showNotification: false
    }

    componentDidMount() {

        this.props.socket.on('formAdded', (res) => {
            if (res.depatmentName === this.props.department) {
                this.setState({showNotification: true, notification: 'New Form Added !'})
                setTimeout(() => this.setState({showNotification: false}), 4000);
            }

        })
        this.props.socket.on('formApproved', (res) => {
            if (res.depatmentName === this.props.department) {
                this.setState({showNotification: true, notification: 'Form Approved !'})
                setTimeout(() => this.setState({showNotification: false}), 4000);
            }
        })
        this.props.socket.on('formRejected', (res) => {
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
const mapStateToProps = state => ({socket: state.auth.socket, department: state.auth.department, isAuthenticated: state.auth.isAuthenticated});
export default connect(mapStateToProps, null)(NotificationWindow);
