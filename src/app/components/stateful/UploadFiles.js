import React, {Component} from 'react';
import { attachModelToView } from 'rhelena';

import { Form, Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import UploadFilesModel from './UploadFilesModel';

export default class UploadFiles extends Component {

    componentWillMount(){
        attachModelToView(new UploadFilesModel(this.props), this);
    }

    render(){
        return (
            <Modal show={this.state.show} size="lg" fullscreen={true} onHide={() => this.viewModel.close()}>
                <Modal.Header closeButton>
                <Modal.Title>Upload Files</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formAdGroups">
                            <Form.Label>Files</Form.Label>
                            <ul>
                                { this.state.uploadFilePayload.filePaths && this.state.uploadFilePayload.filePaths.map((item) => 
                                    <li> {item} </li> 
                                )}
                            </ul>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAdGroups">
                            <Form.Label>Groups with Read Access</Form.Label>
                            <AsyncSelect 
                                onChange={(select) => this.viewModel.handleAdGroupsSelect(select)} 
                                // options={this.state.userGroups} 
                                isMulti 
                                defaultOptions={this.state.userGroups}
                                cacheOptions={true}
                                loadOptions={(inputValue) => this.viewModel.loadOptions(inputValue)}
                                isLoading={this.state.isLoading}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDataAdmin">
                            <Form.Label>Data Admin</Form.Label>
                            <Select onChange={(select) => this.viewModel.handleDataAdminSelect(select)} options={this.state.dataAdmin} />
                        </Form.Group>

                        <Button className="float-right" type="button" onClick={() => this.viewModel.uploadFiles()}>Upload Files</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}