import React, {Component} from 'react';
import { attachModelToView } from 'rhelena';

import { CardColumns, Card, Button } from 'react-bootstrap';

import PillItem from './PillItem';
import PillGroupModel from './PillGroupModel';

export default class PillGroup extends Component {

    componentWillMount(){
        attachModelToView(new PillGroupModel(this.props), this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.items) {
            this.viewModel.setPillGroupItem(nextProps.items);
        }
    }

    render(){
        return (
            <Card style={{ minHeight: '50em' }}>
                <Card.Header>
                    <div style={{ display: 'flex', alignItems: "center", height: "100%", width: "100%" }}>
                        <div style={{ flex:'auto', justifyContent: "flex-start" }}>
                            { this.props.title }     
                        </div>
                        <div style={{ flex:'auto', justifyContent: "flex-end" }}>
                            <Button className="float-right" onClick={() => this.viewModel.downloadFiles()}>Download Files</Button>
                        </div>
                    </div>
                </Card.Header>
                <small>
                    <Card.Body>
                        {this.state.pillGroupItem && this.state.pillGroupItem && 
                            this.props.items.map( item => <PillItem key={item.fileId} item={item} /> )}
                    </Card.Body>
                </small>
            </Card>
        )
    }
}

