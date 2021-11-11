import React, {Component} from 'react';
import { attachModelToView } from 'rhelena';
import CodeModel from './CodeModel';
import { Spinner, Container, Row } from 'react-bootstrap';

export default class Code extends Component {

    componentWillMount(){
        const query = new URLSearchParams(window.location.search)
        attachModelToView(new CodeModel(this.props, query.get("code")), this);
    }

    render(){
        return (
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
                <Row>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </Row>
            </Container>
        )
    }
}