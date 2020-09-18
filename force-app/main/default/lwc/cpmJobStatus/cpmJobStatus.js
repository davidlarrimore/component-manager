import { LightningElement, api } from "lwc";
import jobInfo from "@salesforce/apex/CpmJobStatusController.getJobInfo";
import Utils from "c/utils";

export default class CpmJobStatus extends LightningElement {
  @api jobId;
  _getJob;

  //refreshApex(valueProvisionedByWireService)

  //SELECT Id, Status, ApexClassId, MethodName, ExtendedStatus, JobType, NumberOfErrors FROM AsyncApexJob
  //SELECT Id, Name FROM ApexClass WHERE Id =: AsyncApexJob.ApexClassId

  get jobStatus() {
    return this._getJob.Status;
  }

  get jobExtendedStatus() {
    return this._getJob.ExtendedStatus;
  }

  get jobApexClassId() {
    return this._getJob.ApexClassId;
  }

  get jobMethodName() {
    return this._getJob.MethodName;
  }

  get jobType() {
    return this._getJob.JobType;
  }

  get jobNumberOfErrors() {
    return this._getJob.NumberOfErrors;
  }

  get jobExtendedJobStatus() {
    return this._getJob.Status;
  }

  connectedCallback() {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setInterval(() => {
      if (
        this._getJob.Status !== "Completed" &&
        this._getJob.Status !== "Failed"
      ) {
        console.log("refreshing.....");
        this.doJobSearch();
      }
    }, 5000);

    this.doJobSearch();
  }

  doJobSearch() {
    jobInfo({ recordId: this.jobId })
      .then((result) => {
        console.log("Running wired_Job");
        if (result) {
          console.log(`Receive Job Record: ${JSON.stringify(result[0])}`);
          this._getJob = result[0];
          if(this._getJob.Status === "Failed"){
            Utils.showToast(this, 'Job Failed', `Job ${this.jobId} failed with message: ${this.jobExtendedStatus}`, 'error');
          }
          this.error = undefined;
        }
      })
      .catch((error) => {
        console.log(`wired_Job had an error: ${JSON.stringify(error)}`);
        this.error = error;
        this.contacts = undefined;
      });
  }

  get jobStatusClass() {
    if (this._getJob.Status === "Completed") {
      return "slds-badge slds-theme_success";
    } else if (this._getJob.Status === "Queued") {
      return "slds-badge";
    } else if (this._getJob.Status === "Processing") {
      return "slds-badge slds-theme_warning";
    } else if (this._getJob.Status === "Failed") {
      return "slds-badge slds-theme_error";
    }
    return "slds-badge_lightest";
  }
}
