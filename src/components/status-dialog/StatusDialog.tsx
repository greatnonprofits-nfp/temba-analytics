import React, {createRef} from "react";
import "./StatusDialog.scss"
import {getRequestHeaders, renderIf} from "../../utils";
import {DataStatus} from "../../utils/types";
import moment from "moment";
import axios from "axios";

interface StatusDialogProps {
  refreshUrl: string,
  dataStatus: DataStatus,
  isVisible: boolean,
  onStateChanged: (dataStatus: DataStatus, isVisible: boolean, refreshFields?: boolean) => any,
}

interface StatusDialogState {
  dataStatus: DataStatus,
  isVisible: boolean,
  submitting: boolean,
}

export default class StatusDialog extends React.Component<StatusDialogProps, StatusDialogState> {
  modalRef: any;
  interval: any;
  delay = 5000;

  constructor(props: StatusDialogProps) {
    super(props);
    this.state = {isVisible: props.isVisible, dataStatus: props.dataStatus, submitting: false};
    this.modalRef = createRef();
  }

  componentWillReceiveProps(nextProps: Readonly<StatusDialogProps>) {
    this.setState({isVisible: nextProps.isVisible, dataStatus: nextProps.dataStatus});
    this.modalRef.current.open = nextProps.isVisible;
    if (!nextProps.dataStatus.completed && nextProps.isVisible) {
      this.modalRef.current.submitting = true;
      this.startAutoRefresh();
    }
  }

  componentDidMount() {
    this.modalRef.current.open = this.state.isVisible;
    this.modalRef.current.hideOnClick = false;
    this.modalRef.current.handleClick = (evt: any) => {
      const button: any = evt.currentTarget;
      if (!button.disabled) {
        if (button.primary) {
          if (!this.modalRef.current.submitting) {
            this.modalRef.current.submitting = true;
            this.requestStatusRefresh(true).then((response) => {
              this.setState({dataStatus: response.data});
              this.startAutoRefresh();
            }).catch(() => {
              this.stopAutoRefresh();
              this.modalRef.current.submitting = false;
              this.props.onStateChanged(this.state.dataStatus, false);
            });
          }
        } else {
          this.stopAutoRefresh();
          this.modalRef.current.submitting = false;
          this.props.onStateChanged(this.state.dataStatus, false);
        }
      }
    };
    if (!this.state.dataStatus.completed) {
      this.modalRef.current.submitting = true;
      this.startAutoRefresh();
    }
  }

  componentWillUnmount() {
    this.stopAutoRefresh();
  }

  private startAutoRefresh() {
    if (!!this.interval) return;
    this.interval = setInterval(() => {
      this.requestStatusRefresh().then(response => {
        let newDataStatus: DataStatus = response.data;
        if (newDataStatus.completed) {
          this.stopAutoRefresh();
          this.modalRef.current.submitting = false;
          this.props.onStateChanged(this.state.dataStatus, false, true);
        }
      }).catch(() => {
        this.stopAutoRefresh();
        this.modalRef.current.submitting = false;
        this.props.onStateChanged(this.state.dataStatus, false);
      });
    }, this.delay);
  }

  private stopAutoRefresh() {
    if (!!this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private requestStatusRefresh(completely = false) {
    return axios.post(
      this.props.refreshUrl, {"onlyStatus": !completely}, {headers: getRequestHeaders()}
    );
  }

  private static renderDateTime(dateString: string | null) {
    let date = moment(dateString);
    return <>{date.format("MMM DD, YYYY h:mma")}</>
  }

  private getProgress() {
    let progress: number = this.state.dataStatus.progress;
    progress = parseFloat(progress.toFixed(2)) * 100;
    return parseInt(progress.toString());
  }

  render() {
    return <temba-dialog
      ref={this.modalRef}
      header={"Analytics Status"}
      primaryButtonName={"Refresh"}
      cancelButtonName={"Close"}
    >
      <div className="p-6 body">
        {renderIf(!this.state.dataStatus.lastUpdated)(
          <div>You have no prefetched data to build the analytics. Please click the 'Refresh' button to prefetch it
            now.</div>
        )}
        {renderIf(!!this.state.dataStatus.lastUpdated && this.state.dataStatus.completed)(
          <div>Last time when analytics data was prefetched was
            on {StatusDialog.renderDateTime(this.state.dataStatus.lastUpdated)}</div>
        )}
        {renderIf(!!this.state.dataStatus.lastUpdated && !this.state.dataStatus.completed)(
          <>
            <div>We are collecting new data to build analytics. Please wait until the process will be completed.</div>
            <div>Current progress: {this.getProgress()}%</div>
          </>
        )}
      </div>
    </temba-dialog>;
  }
}
