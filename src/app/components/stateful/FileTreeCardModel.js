import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh';

export default class FileTreeCardModel extends RhelenaPresentationModel {

    constructor(props){
        super(props);

        // this.rawFileTree = props.fileTree;
        // this.fileTree = null;
        this.fileTree = props.fileTree;
    }

    // loadTree(){
    //     this.fileTree = this.extractData(this.rawFileTree);
    // }

    setRawFileTree(fileTree){
        this.fileTree = fileTree;
    }

    extractData(item){
        let result = [];
        for(let localItem of item){
            if(localItem.children && localItem.children.length > 0){
                result.push({ label: localItem.name ? localItem.name : localItem.filename, value: localItem.fullPath, children: this.extractData(localItem.children)})
            }else{
                result.push({ label: localItem.name ? localItem.name : localItem.filename, value: localItem.fullPath })
            }    
        }
        return result;
    }

    uploadFile() {
        manuh.publish('archiver/upload/open', { open: true });
    }


}