import React, {Component} from 'react';
import { attachModelToView } from 'rhelena';
import manuh from 'manuh';

import { Card, Spinner, Button, Alert } from 'react-bootstrap';
import helper from '../../../helper';

import CheckboxTree from 'react-checkbox-tree'
import FileTreeCardModel from './FileTreeCardModel';

export default class FileTreeCard extends Component {

    state = {
        checked: [],
        expanded: [],
    }

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    onCheck(checked) {
        let selected = [];
        for(let item of checked){
            if(helper.treeMap[item] == "dir"){
                selected.push(item);
            }
        }
        manuh.publish('archiver/upload/files/set', { files: selected }, { retained: true });
        this.setState({ checked });
    }

    onExpand(expanded) {
        this.setState({ expanded });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.fileTree !== this.state.rawFileTree) {
            this.viewModel.setRawFileTree(nextProps.fileTree);
        }
      }

    componentWillMount(){
        attachModelToView(new FileTreeCardModel(this.props), this);
    }

    render(){
        const { checked, expanded } = this.state;

        return (
            <Card style={{ minHeight: '50em' }}>
                <Card.Header>
                    <div style={{ display: 'flex', alignItems: "center", height: "100%", width: "100%" }}>
                        <div style={{ flex:'auto', justifyContent: "flex-start" }}>
                            { this.props.title }     
                        </div>
                        <div style={{ flex:'auto', justifyContent: "flex-end" }}>
                            <Button className="float-right" onClick={() => this.viewModel.uploadFile()}>Upload Files</Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    { this.state.fileTree != null && 
                        <CheckboxTree
                            nodes={this.state.fileTree}
                            checked={checked}
                            expanded={expanded}
                            checkModel="all"
                            onCheck={this.onCheck}
                            onExpand={this.onExpand}
                            iconsClass="fa5"
                        /> }
                    {  this.state.fileTree == null &&
                        <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    }
                </Card.Body>
            </Card>
        )
    }


}
