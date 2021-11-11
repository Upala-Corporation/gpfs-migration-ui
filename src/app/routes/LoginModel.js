import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh';
import config from '../../config';

export default class LoginModel extends RhelenaPresentationModel {
    constructor(props){
        super(props);
    }
    
    login(){
        if (localStorage.getItem("migrationPortal/token")) {
            window.location.href = "/app";
        }else{
            window.location.href = `${config.oauthURL}/oauth2/v2.0/authorize?response_type=code&client_id=${config.oauthClientId}&scope=openid%20${config.oauthClientId}/.default&redirect_uri=${config.oauthRedirectURI}`;
        }
    }
}