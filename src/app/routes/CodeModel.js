import React, { Component } from 'react'; 
import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh';
import axios from 'axios';
import config from '../../config';

export default class CodeModel extends RhelenaPresentationModel {
    constructor(props, code){
        super(props);

        this.code = code;
        this.error = null;

        this.getOauthToken();
    }

    async getOauthToken(){
        try{
            let response = await axios.get(`${config.apiURL}/v1/login/code`, {
                params: {
                    code: this.code
                }
            });
            if (response.status == 200) {
                localStorage.setItem("migrationPortal/token", JSON.stringify(response.data));
                window.location.href = "/";
            }
        }catch(e) {
            console.log("Error: ", e);
            this.error = e;
        }
    }

    
}