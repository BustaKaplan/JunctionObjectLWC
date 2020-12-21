import { LightningElement, wire, api } from 'lwc';
import childRecords from '@salesforce/apex/getChildRecords.getChildRecords';
import createJunctionRecords from '@salesforce/apex/getChildRecords.createJunctionRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';


const columns = [
    { label: 'Name', fieldName: 'Name' }
];
const selectedRows= [];

export default class ApexWireMethodToProperty extends LightningElement {
    @api recordId;
    @wire(childRecords) records;
    //@track message;
    //@track error;
    columns = columns; 

    createSelected() {
        //retrieve the selected rows
        this.selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows();
        console.log(this.selectedRows);
        //Pass the selected rows to the APEX Class
        createJunctionRecords({ childList : this.selectedRows, parentRecordId: this.recordId  })
        //Show error or success message
            .then(result => {
                console.log("result: " + result);
                this.message = result;
                this.error = undefined;
                if(this.message != undefined) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            //message: this.body.message,
                            message: 'Success',
                            variant: 'success',
                        }),
                    );
                }
                
                console.log(JSON.stringify(result));
                console.log("message", this.message);
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            }
            .finally(){
            //refresh all the check boxes
            refreshList();
            };
           
    }
    refreshList(){
        console.log('refresh list called');
        // Notify LDS that you've changed the record outside its mechanisms.
        getRecordNotifyChange([{recordId: this.recordId}]);
    }
}
