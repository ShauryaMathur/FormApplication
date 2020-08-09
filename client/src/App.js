import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import DepartmentForm from './components/DepartmentForm'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './components/navbar';
import './App.css';
import {Provider} from 'react-redux';
import store from './store';
import {Container} from 'reactstrap';
import {loadUser} from './actions/authactions';
import PendingForms from './components/PendingForms';
import RequestedForms from './components/RequestedForms'
import ApprovedForms from './components/ApprovedForms'
import RejectedForms from './components/RejectedForms'
import NotificationWindow from './components/NotificationWindow'


class App extends Component {

    componentDidMount() {
        store.dispatch(loadUser());
    }
    render() {
        return (<Router>
            <Provider store={store}>
                <div className="App">
                    <AppNavbar/>
                    <Container>
                        <Route exact path="/"
                            component={DepartmentForm}/>
                        <Route path="/pendingForms"
                            component={PendingForms}/>
                        <Route path="/requestedForms"
                            component={RequestedForms}/>
                        <Route path="/approvedForms"
                            component={ApprovedForms}/>
                        <Route path="/rejectedForms"
                            component={RejectedForms}/>
                        <NotificationWindow/>
                    </Container>
                </div>
            </Provider>
        </Router>);
    }
}

export default App;
