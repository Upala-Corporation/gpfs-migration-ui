import { id } from 'postcss-selector-parser';
import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh';

import axios from 'axios';
import config from '../../../config';

import payloadListLocal from '../../../payload-list-local';

export default class UploadFilesModel extends RhelenaPresentationModel {

    constructor(props){
        super(props);

        this.userGroups = [];
        this.dataAdmin = []
        this.show = false;
        this.error = null;
        this.isLoading = false;

        this.selectedAdGroups = null;
        this.selectedDataAdminGroup = null;

        this.uploadFilePayload = {
            fileUserGroups: null,
            dataAdmin: null,
            filePaths: []
        }
        
        manuh.subscribe('archiver/upload/files/set', "upload-files-set", (msg, info) => {
            this.uploadFilePayload.filePaths = msg.files;
        })

        manuh.subscribe('archiver/upload/open', "upload-files-open", (msg, info) => {
            this.show = true;
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

        this.loadUserGroups()
        this.loadDataAdmin()
    }

    async loadUserGroups(){
        this.isLoading = true;
        try{
            this.errorFileTree = null;
            let response = await this.axiosInstance.get("/v1/qry/ad");
            if(response.data){
                response.data.map(item => {
                    this.userGroups.push({ value: item, label: item })
                });
            }
        }catch(e){
            if (e.response){
                console.log("Error: ", e.response)
                this.error = { status: e.response.status, message: e.response.data.message };
            }else{
                this.error = { status: 500 , message: "Could not fetch this resource"}
            }
        }
        this.isLoading = false;
    }

    async loadOptions(valueInput){
        let foundGroups = [];
        if(valueInput != null && valueInput.length > 2){
            this.isLoading = true;
            try{
                this.errorFileTree = null;
                let response = await this.axiosInstance.get(`/v1/qry/ad-filter?input=${valueInput}`);
                if(response.data){
                    response.data.map(item => {
                        foundGroups.push({ value: item, label: item })
                        if (this.userGroups.findIndex(x => x.value == item) === -1) {
                            this.userGroups.push({ value: item, label: item })
                        }
                    });                    
                }
            }catch(e){
                if (e.response){
                    console.log("Error: ", e.response)
                    this.error = { status: e.response.status, message: e.response.data.message };
                }else{
                    this.error = { status: 500 , message: "Could not fetch this resource"}
                }
            }
            this.isLoading = false;
        }
        return foundGroups;
    }

    async loadDataAdmin(){
        try{
            this.errorFileTree = null;
            let response = await this.axiosInstance.get("/v1/qry/data/admin");
            if(response.data){
                response.data.map(item => {
                    this.dataAdmin.push({ value: item.id , label: item.description })
                });
            }
        }catch(e){
            if (e.response){
                console.log("Error: ", e.response)
                this.error = { status: e.response.status, message: e.response.data.message };
            }else{
                this.error = { status: 500 , message: "Could not fetch this resource"}
            }
        }
    }

    handleAdGroupsSelect(select){
        this.selectedAdGroups = select;
    }

    handleDataAdminSelect(select){
        this.selectedDataAdminGroup = select;
    }

    async uploadFiles(){
        this.uploadFilePayload.fileUserGroups = [];
        this.selectedAdGroups.map(item => {
            this.uploadFilePayload.fileUserGroups.push(item.value);
        })
        this.uploadFilePayload.dataAdmin = { id: this.selectedDataAdminGroup.value , description: this.selectedDataAdminGroup.label };
        try{
            let result = await this.axiosInstance.post("/v1/files/upload", this.uploadFilePayload);
            Object.keys(result.data).forEach(function(key, index) {
                if(result.data[key]){
                    manuh.publish("archiver/app/notification", { type: 'success', content: `File ${key} is on upload queue`} , {});
                }else{
                    manuh.publish("archiver/app/notification", { type: 'error', content: `Failed to send file ${key} to upload queue`} , {});
                }
            });
            manuh.publish("archiver/app/refreshRemoteFiles", {}, {});
            this.close();
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

    close(){
        this.show = false;
    }
    
}