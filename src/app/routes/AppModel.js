import React, { Component } from 'react'; 
import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh';
import axios from 'axios';
import config from '../../config';
import payload from '../../payload-list-local';
import { toast } from 'react-toastify';
import helper from '../../helper';
export default class AppModel extends RhelenaPresentationModel {
    constructor(props){
        super(props);
        this.token = null;
        this.user = null;
        this.resource = null;
        this.error = null;
        this.provisioningResource = null;
        
        this.userBasePath = null;
        this.errorBasePath = null;

        this.localFilesTree = null;
        this.errorFileTree = null;

        this.remoteFiles = null;
        this.errorRemoteFiles = null;

        if (typeof localStorage.getItem("migrationPortal/token") == 'object') {
            this.token = JSON.parse(localStorage.getItem("migrationPortal/token"));
        }else{
            this.token = localStorage.getItem("migrationPortal/token");
        }

        if(!this.token){
            window.location.href = "/";
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

        this.delay = (ms) => new Promise(res => setTimeout(res, ms))

        this.getUserBasePath();
        this.getUserLocalFiles();
        this.getUserRemoteFiles();

        manuh.subscribe('archiver/app/notification', "app-notification", (msg, info) => {
            if(msg.type == "success"){
                toast.success(msg.content, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }else{
                toast.error(msg.content, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        })

        manuh.subscribe('archiver/app/refreshRemoteFiles', "app-refresh-remote-files", (msg, info) =>  {
            this.getUserRemoteFiles();
        });

        manuh.subscribe('archiver/app/refreshLocalFiles', "app-refresh-local-files", (msg, info) =>  {
            this.getUserLocalFiles();
        });

        manuh.subscribe('archiver/app/refreshLogin', "app-refresh-login", (msg, info) => {
            // localStorage.removeItem("migrationPortal/token");
            // window.location.href = '/';
        })
    }

    async logout(){
        localStorage.removeItem("migrationPortal/token");
        window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${config.baseURL}`;
    }

    async getUserBasePath(){
        try{
            this.userBasePath = "";
            this.errorBasePath = null;
            let response = await this.axiosInstance.get("/v1/qry/base/path");
            let resultLocal = response.data;
            if(resultLocal){
                this.userBasePath = resultLocal.filePath;
                return;
            }
            this.userBasePath = "";
        }catch(e){
            if (e.response){
                if (e.response.status == 401){
                    manuh.publish("archiver/app/refreshLogin", {});
                }
                console.log("Error: ", e.response)
                this.errorBasePath = { status: e.response.status, message: e.response.data.message };
            }else{
                this.errorBasePath = { status: 500 , message: "Could not fetch this resource"}
            }
        }
    }

    async getUserLocalFiles(){
        try{
            this.errorFileTree = null;
            let response = await this.axiosInstance.get("/v1/files/local");
            let resultLocal = this.extractDataLocal(response.data);
            this.localFilesTree = resultLocal;
        }catch(e){
            if (e.response){
                if (e.response.status == 401){
                    manuh.publish("archiver/app/refreshLogin", {});
                }
                console.log("Error: ", e.response)
                this.errorFileTree = { status: e.response.status, message: e.response.data.message };
            }else{
                this.errorFileTree = { status: 500 , message: "Could not fetch this resource"}
            }
        }
    }

    async getUserRemoteFiles(){
        try{
            this.errorRemoteFiles = null;
            let response = await this.axiosInstance.get("/v1/files/remote");
            this.remoteFiles = response.data;
        }catch(e){
            if (e.response){
                if (e.response.status == 401){
                    manuh.publish("archiver/app/refreshLogin", {});
                }
                console.log("Error: ", e.response)
                this.errorRemoteFiles = { status: e.response.status, message: e.response.data.message };
            }else{
                this.errorRemoteFiles = { status: 500 , message: "Could not fetch this resource"}
            }
        }
    }

    extractDataLocal(item){
        let result = [];
        for(let localItem of item){
            if(!localItem.disabled && localItem.children && localItem.children.length > 0){
                result.push({ label: localItem.name, value: localItem.fullPath, children: this.extractDataLocal(localItem.children)})
                helper.treeMap[localItem.fullPath] = "dir";
            }else{
                result.push({ label: localItem.name, value: localItem.fullPath, showCheckbox: false })
                helper.treeMap[localItem.fullPath] = "file";
            }    
        }
        return result;
    }

    extractDataRemote(item){
        let result = [];
        for(let localItem of item){
            result.push({ label: localItem.filename, value: localItem.fullPath })
        }
        return result;
    }

    setLocalTreeChecked(localTreeChecked){
        this.localTreeChecked = localTreeChecked;
    }

    setLocalTreeExpanded(localTreeExpanded){
        this.localTreeExpanded = localTreeExpanded;
    }

    cleanError(){
        this.error = null;
    }

}