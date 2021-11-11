import React, {Component} from 'react';
import { attachModelToView } from 'rhelena';

import { BsCloudDownload } from "react-icons/bs";
import { Card, Spinner, Button, Alert, Row, Col, Form } from 'react-bootstrap';

import PillItemModel from './PillItemModel';

export default class PillItem extends Component {

    componentWillMount(){
        attachModelToView(new PillItemModel(this.props), this);
    }

    render(){
        return (
            <Card style={{ marginBottom: "5px" }}>
                <Card.Body style={{ padding: "0.5em" }}>
                    <Row>
                        <Col xs={12} sm={2} md={3} lg={1} xl={1}>
                            <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                                <Form.Check 
                                    type="checkbox"
                                    id={`default-checkbox`}
                                    value={this.state.item.checked}
                                    onChange={(e) => this.viewModel.checkItem(e)}
                                />
                            </div>
                        </Col>
                        <Col xs={12} sm={9} md={5} lg={6} xl={6}> 
                            <Card.Title style={{ fontSize: '1em'}}>
                                <span>
                                    <b>{this.state.item.filename}</b>
                                </span>
                            </Card.Title>
                            <Card.Subtitle style={{ fontSize: '0.8em'}} className="mb-2 text-muted">{this.state.item.path}</Card.Subtitle>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={5} xl={5}>
                            <Card.Text style={{ display: 'flex', alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                                <span>
                                    <small><b>Creation Date: </b>{this.state.item.creationDate}</small><br/>
                                </span>
                            </Card.Text>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    }
}