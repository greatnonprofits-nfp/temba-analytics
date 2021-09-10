import React, {createRef} from "react";
import "./StatusDialog.scss"
import {getRequestHeaders, renderIf} from "../../utils";
import {DataStatus, Flow} from "../../utils/types";
import moment from "moment";
import axios from "axios";
import Select from "react-select";

interface StatusDialogProps {
  refreshUrl: string,
  dataStatus: DataStatus,
  isVisible: boolean,
  onStateChanged: (dataStatus: DataStatus, isVisible: boolean, refreshFields?: boolean) => any,
  availableFlows: Flow[],
}

interface StatusDialogState {
  dataStatus: DataStatus,
  isVisible: boolean,
  submitting: boolean,
  availableFlows: { label: string, value: any }[];
  selectedFlow: { label: string, value: any };
}

export default class StatusDialog extends React.Component<StatusDialogProps, StatusDialogState> {
  modalRef: any;
  interval: any;
  delay = 5000;

  constructor(props: StatusDialogProps) {
    super(props);
    let allFlowsItem = {label: "All Flows", value: null};
    this.state = {
      isVisible: props.isVisible,
      dataStatus: props.dataStatus,
      submitting: false,
      availableFlows: [allFlowsItem, ...this.props.availableFlows.map(flow => ({label: flow.text, value: flow.id}))],
      selectedFlow: allFlowsItem,
    };
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
    if (!this.state.dataStatus.completed && this.state.isVisible) {
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
          this.props.onStateChanged(newDataStatus, false, true);
        } else {
          this.setState({dataStatus: newDataStatus});
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
      this.props.refreshUrl,
      {
        "onlyStatus": !completely,
        "flow": this.state.selectedFlow.value,
      },
      {headers: getRequestHeaders()}
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
        {renderIf(this.state.dataStatus.completed)(
          <div className={"flow-selector"}>
            <Select
              searchable={true}
              placeholder={"Select the flow"}
              styles={{
                control: (provided: any) => ({
                  ...provided,
                  "&:focus-within": {
                    borderColor: "var(--color-focus)",
                    background: "var(--color-widget-bg-focused)",
                    boxShadow: "var(--widget-box-shadow-focused)",
                  }
                }),
                menu: (provided: any) => ({
                  ...provided,
                  position: "inherit",
                  padding: "2px",
                }),
                menuList: (provided: any) => ({
                  ...provided,
                  padding: "2px",
                }),
                option: (provided: any) => ({
                  ...provided,
                  fontSize: "14px",
                  padding: "5px 0 5px 10px",
                  borderRadius: "4px",
                  marginBottom: "3px",
                  cursor: "pointer",
                  color: "var(--color-text-dark)",
                  background: "var(--color-widget-bg-focused)",
                  "&:hover": {
                    background: "var(--color-selection)",
                  }
                }),
              }}
              options={this.state.availableFlows}
              value={this.state.selectedFlow}
              onChange={(selectedFlow: any) => {
                this.setState({selectedFlow});
              }}
            />
            <div className={"flows-help"}>Select the flows that you want to refresh the data for</div>
          </div>
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
