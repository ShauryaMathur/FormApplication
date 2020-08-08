import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap';
import Logout from './Auth/Logout';
import DepartmentForm from './DepartmentForm';
// import PendingForms from './PendingForms';
// import ApprovedForms from './ApprovedForms';
// import RequestedForms from './RequestedForms';
// import RejetedForms from './RejectedForms';
import PropTypes from 'prop-types';
import RegisterModal from './Auth/RegisterModal';
import LoginModal from './Auth/LoginModal';
import {connect} from 'react-redux';

class AppNavbar extends Component {

    state = {
        isOpen: false
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        const {isAuthenticated, user} = this.props.auth;

        const authLinks = (<Fragment>
            <NavItem>
< NavLink href = "/" > Form </NavLink>

            </NavItem>
            <NavItem>
                <NavLink href="/pendingForms">Pending Forms
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/requestedForms">Requested Forms</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/approvedForms">Approved Forms</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/rejectedForms">
                    Rejected Forms
                </NavLink>
            </NavItem>

            <NavItem>
                <span className="navbar-text mr-3">
                    <strong> {
                        user ? `Welcome ${
                            user.name
                        }` : ''
                    }</strong>
                </span>
            </NavItem>
            <NavItem>
                <Logout/>
            </NavItem>
        </Fragment>);

        const guestLinks = (<Fragment>
            <NavItem>
                <RegisterModal/>
            </NavItem>
            <NavItem>
                <LoginModal/>
            </NavItem>
        </Fragment>);

        return (<div>
            <Navbar color="dark" dark expand="sm" className="mb-5">
                <Container>
                    <NavbarToggler onClick={
                        this.toggle
                    }/>
                    <Collapse isOpen={
                            this.state.isOpen
                        }
                        navbar>
                        <Nav className="ml-auto" navbar> {
                            isAuthenticated ? authLinks : guestLinks
                        } </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </div>);

    }
}

const mapStateToProps = state => ({auth: state.auth});

export default connect(mapStateToProps, null)(AppNavbar);
