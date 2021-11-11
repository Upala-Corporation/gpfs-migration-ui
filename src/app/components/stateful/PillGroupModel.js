import { RhelenaPresentationModel } from 'rhelena';
import axios from 'axios';
import config from '../../../config';
import manuh from 'manuh';

export default class PillItemModel extends RhelenaPresentationModel {

    constructor(props){
        super(props);

        this.error = null;
        this.pillGroupItem = this.setPillGroupItem(props.items);
        
        manuh.subscribe('archiver/download/check/item', "download-files-set", (msg, info) => {
            for(let item in this.pillGroupItem){
                if(msg.fileId == this.pillGroupItem[item].fileId){
                    this.pillGroupItem[item].checked = msg.checked;
                }
            }
        })

        if (typeof localStorage.getItem("migrationPortal/token") == 'object') {
            this.token = JSON.parse(localStorage.getItem("migrationPortal/token"));
        }else{
            this.token = localStorage.getItem("migrationPortal/token");
        }
        const defaultOptions = {
            baseURL: `${config.apiURL}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${JSON.parse(this.token).access_token}`
            }
          };
        
        this.axiosInstance = axios.create(defaultOptions);
    }

    setPillGroupItem(item) {
        if (item) {
            item.map(item => item.checked = false);
            this.pillGroupItem = JSON.parse(JSON.stringify(item));
        }
    }

    async downloadFiles(){
        let fileIds = [];
        this.pillGroupItem.map(item => {
            if (item.checked){
                fileIds.push(item.fileId);
            }
        });
        try{
            let result = await this.axiosInstance.post(`/v1/files/download/bulk`, { fileIds });
            Object.keys(result.data).forEach(function(key, index) {
                if(result.data[key]){
                    manuh.publish("archiver/app/notification", { type: 'success', content: `Path with ID ${key} is on download queue`} , {});
                }else{
                    manuh.publish("archiver/app/notification", { type: 'error', content: `Failed to send file ${key} to download queue`} , {});
                }
            });
        }catch(e){
            if (e.response){
                if (e.response.status == 401){
                    manuh.publish("archiver/app/refreshLogin", {});
                }
                console.log("Error: ", e.response)
                this.error = { status: e.response.status, message: e.response.data.message };
            }else{
                this.error = { status: 500 , message: "Could not post this resource"}
            }
            manuh.publish("archiver/app/notification", { type: 'error', content: `Status ${this.error.status} - ${this.error.message}`} , {});
        }
    }
    
}