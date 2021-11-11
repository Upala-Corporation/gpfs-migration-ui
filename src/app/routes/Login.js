import React, {Component} from 'react';
import { attachModelToView } from 'rhelena';
import LoginModel from './LoginModel';
import { Spinner, Container, Row } from 'react-bootstrap';

export default class Login extends Component {

    componentWillMount(){
        attachModelToView(new LoginModel(this.props), this);
    }

    render(){
        return (
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
                <Row>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                    {this.viewModel.login()}
                </Row>
            </Container>
        )
    }
}