import { RhelenaPresentationModel } from 'rhelena';
import axios from 'axios';
import config from '../../../config';
import manuh from 'manuh';

export default class PillItemModel extends RhelenaPresentationModel {

    constructor(props){
        super(props);

        this.error = null;

        this.item = props.item;

        // this.token = "{\"token_type\":\"Bearer\",\"scope\":\"e494ef3d-846c-48c7-96a9-2b37b6992fbc/User.Read e494ef3d-846c-48c7-96a9-2b37b6992fbc/.default\",\"expires_in\":3599,\"ext_expires_in\":3599,\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiJlNDk0ZWYzZC04NDZjLTQ4YzctOTZhOS0yYjM3YjY5OTJmYmMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8wZWZlMjJjOC05M2JhLTRjMDgtOTljYy03MTFjMmJmNGFkOWIvIiwiaWF0IjoxNjMyMTYzMjI0LCJuYmYiOjE2MzIxNjMyMjQsImV4cCI6MTYzMjE2NzEyNCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQTNRa2NjZzg5NG1IK21jMUpLSVp2RFdmM1hTOTZSREJhdW5IVHFUUERNZUY5aTVVWW5DMFYrQnkzdmtZTXlwQ0MyUkltUUxpSDRyRmJMOU9WaXRXaEFXUnNSckhqLzJuRVF0dGZlQnFLT05JPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiJlNDk0ZWYzZC04NDZjLTQ4YzctOTZhOS0yYjM3YjY5OTJmYmMiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IkRlU291emEgSnIiLCJnaXZlbl9uYW1lIjoiSmFpciIsImlwYWRkciI6Ijg0LjEwNy4yNTEuMjMiLCJuYW1lIjoiSmFpciBEZVNvdXphIEpyIiwib2lkIjoiYzdiYzllNjUtM2MyNi00NTgxLWFhMzctMTRlNzgwYmU1ZDQ5IiwicmgiOiIwLkFXSUF5Q0wtRHJxVENFeVp6SEVjS19TdG16M3ZsT1JzaE1kSWxxa3JON2FaTDd4aUFIZy4iLCJzY3AiOiJVc2VyLlJlYWQiLCJzdWIiOiJPM2xVZzV2aEk5ZEtTc25taFVhT0NFZ3VlRXR1TU80V1UyVWRCMXFDSy1vIiwidGlkIjoiMGVmZTIyYzgtOTNiYS00YzA4LTk5Y2MtNzExYzJiZjRhZDliIiwidW5pcXVlX25hbWUiOiJqYWlyQHVwYWxhY29ycG9yYXRpb24ub25taWNyb3NvZnQuY29tIiwidXBuIjoiamFpckB1cGFsYWNvcnBvcmF0aW9uLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IkY4eGdJVWdxUGtpeDhJMXgzQzRIQUEiLCJ2ZXIiOiIxLjAifQ.HZlipjJ8J97LejGg_rYpOdCrHJdi-Wi1kS2G_yy100Si1ERQZ_Ui0ucefynAZ0pXPrN-YBYitaz93OVWW1tGwPzf2-2CKJer8UZg_DhOWlO0AW8XZ8wtdIHYq6GzMos4yQVCAGid0s3Atr8hAatZMmn51RvFIUeL3r0zCYxdPZH65gffNpC2m-QetjKyrPcEJSDtQBJ0T2i620n6SXL1XH7kG_c3I9aFrlnyEW0c-bKdf6jvUCQDokS8AS5BB6Axw4TfdYfDAjZwSpUz2fl75Gdk6qLgzkQTYudL9LX7HskJ-p8nt1FQ3HwqIEjm_5Wxa-T6xrjrBe9yB1iQKaWvcQ\",\"id_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiJlNDk0ZWYzZC04NDZjLTQ4YzctOTZhOS0yYjM3YjY5OTJmYmMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMGVmZTIyYzgtOTNiYS00YzA4LTk5Y2MtNzExYzJiZjRhZDliL3YyLjAiLCJpYXQiOjE2MzIxNjMyMjQsIm5iZiI6MTYzMjE2MzIyNCwiZXhwIjoxNjMyMTY3MTI0LCJyaCI6IjAuQVdJQXlDTC1EcnFUQ0V5WnpIRWNLX1N0bXozdmxPUnNoTWRJbHFrck43YVpMN3hpQUhnLiIsInN1YiI6Ik8zbFVnNXZoSTlkS1Nzbm1oVWFPQ0VndWVFdHVNTzRXVTJVZEIxcUNLLW8iLCJ0aWQiOiIwZWZlMjJjOC05M2JhLTRjMDgtOTljYy03MTFjMmJmNGFkOWIiLCJ1dGkiOiJGOHhnSVVncVBraXg4STF4M0M0SEFBIiwidmVyIjoiMi4wIn0.cdPilstNOUCnZazNGOPaQD8oUahLcDTK4xi74tewgyMo5Xui5Q95FG66T5A7xXpBADkDQO3P_xFZSHRzYw9JQfxMGTnX9f4RQ_hR9-xYNsMU-H85yzCBcN7yUOZ6fAx78lMxbLefkuaMmv2FIMiqVNgjKTY5mokAu922zBQ1eR7Q0BLCjVKCYp8mYql33qJtwgtLZNkaaKIVfVx7LhrTRJ-hWaOerzTW76xL_N2CGF-p8mqF3MSYBCD_quWYnAM044zIyj74XL0eVJBbilqG0oKW7udIdQYBblZxmjm9q3pCqnri3ZTLoNkfnZb7R5Jq2pxVwkkFAywyh15-Fw_VNg\"}";
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

    checkItem(e){
        this.item.checked = e.target.checked;
        manuh.publish('archiver/download/check/item', { fileId: this.item.fileId, checked: e.target.checked}, { retained: true });
    }

    
    async downloadItem(id){
        try{
            let result = await this.axiosInstance.post(`/v1/files/download/id/${id}`, {});
        }catch(e){
            if (e.response){
                console.log("Error: ", e.response)
                this.error = { status: e.response.status, message: e.response.data.message };
            }else{
                this.error = { status: 500 , message: "Could not post this resource"}
            }
        }
    }
}