import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import React, {Component} from 'react';
import { attachModelToView } from 'rhelena';
import AppModel from './AppModel'
import { Container, Row, Col, Navbar, Nav, Card, Spinner, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import FileTreeCard from '../components/stateful/FileTreeCard';
import PillGroup from '../components/stateful/PillGroup';
import UploadFiles from '../components/stateful/UploadFiles';

import payload from '../../payload-list-local';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class App extends Component {

    componentWillMount(){
        attachModelToView(new AppModel(this.props), this);
    }

    render(){
        const { checkedLocal, expandedLocal, checkedRemote, expandedRemote } = this.state;

        return (
            <Container fluid>
                <Row>
                    <Col>
                        <Navbar bg="dark" variant="dark">
                            <Navbar.Brand href="#home" style={{paddingLeft: '10px'}}> GPFS Archiver </Navbar.Brand>
                            <Nav className="mr-auto">
                                {/* <Nav.Link href="#home">Home</Nav.Link> */}
                            </Nav>
                            <Nav className="float-end">
                                <Nav.Link href="#home">{ this.state.user && this.state.user.oauth2Id}</Nav.Link>
                                <Nav.Link onClick={() =>  this.viewModel.logout() }><FontAwesomeIcon icon={faSignOutAlt} /></Nav.Link>
                            </Nav>
                        </Navbar>

                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem'}}>
                            {/* <h5 style={{ textAlign: 'center' }}> Projects </h5>  */}
                        </div>

                        <Row>
                            <Col>
                                { this.state.errorFileTree == null &&
                                    <FileTreeCard title={`Files in ${this.state.userBasePath}`} fileTree={this.state.localFilesTree} /> 
                                }
                                { this.state.errorFileTree != null &&
                                    <div>
                                        <p>
                                            Failed to load content from server:<br/>
                                            Status: {this.state.errorFileTree.status} <br/>
                                            Message: {this.state.errorFileTree.message}
                                        </p>
                                    </div>
                                }
                            </Col>
                            <Col>
                                { this.state.errorRemoteFiles == null &&
                                    <PillGroup title="Files in ADLS" items={this.state.remoteFiles}></PillGroup>
                                }
                                { this.state.errorRemoteFiles != null &&
                                    <div>
                                        <p>
                                            Failed to load content from server:<br/>
                                            Status: {this.state.errorRemoteFiles.status} <br/>
                                            Message: {this.state.errorRemoteFiles.message}
                                        </p>
                                    </div>
                                }
                            </Col>
                        </Row>

                        {/* { !this.state.user && !this.state.error && 
                            <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
                                <div style={{ alignSelf: 'center' }}>
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                            </div>
                        } */}
                        
                        {/* Modal Load */}
                        <UploadFiles></UploadFiles>

                        {/* Toast Load */}
                        <ToastContainer autoClose={5000}/>
                    </Col>
                </Row>
        </Container>
        )
    }
}