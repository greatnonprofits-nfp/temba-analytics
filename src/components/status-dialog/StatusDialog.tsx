import React, {createRef} from "react";
import "./StatusDialog.scss"
import {renderIf} from "../../utils";
import {DataStatus} from "../../utils/types";
import moment from "moment";

interface StatusDialogProps {
  dataStatus: DataStatus,
  isVisible: boolean,
  onSubmit: (data: any) => any;
  onClose: () => any;
}

interface StatusDialogState {
  dataStatus: DataStatus,
  isOpen: boolean,
}

export default class StatusDialog extends React.Component<StatusDialogProps, StatusDialogState> {
  modalRef: any;

  constructor(props: StatusDialogProps) {
    super(props);
    this.state = {isOpen: props.isVisible, dataStatus: props.dataStatus};
    this.modalRef = createRef();
  }

  componentWillReceiveProps(nextProps: Readonly<StatusDialogProps>) {
    this.setState({isOpen: nextProps.isVisible, dataStatus: nextProps.dataStatus});
    this.modalRef.current.open = nextProps.isVisible;
  }

  componentDidMount() {
    this.modalRef.current.addEventListener("temba-button-clicked", this.handleDialogButtonClicked.bind(this));
    this.modalRef.current.open = this.state.isOpen;
  }

  componentWillUnmount() {
    this.modalRef.current.removeEventListener("temba-button-clicked", this.handleDialogButtonClicked.bind(this));
  }

  private handleDialogButtonClicked(evt: any) {
    if (!evt.detail.button.secondary) {
      this.props.onSubmit({});
    } else {
      this.props.onClose();
    }
  }

  private renderDateTime(dateString: string | null) {
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
      primaryButtonName={this.state.dataStatus.completed ? "Refresh" : ""}
      cancelButtonName={"Close"}
      hideOnClick={false}
    >
      <div className="p-6 body">
        {renderIf(!this.state.dataStatus.lastUpdated)(
          <div>You have no prefetched data to build the analytics. Please click the 'Refresh' button to prefetch it
            now.</div>
        )}
        {renderIf(!!this.state.dataStatus.lastUpdated && this.state.dataStatus.completed)(
          <div>Last time when analytics data was prefetched was
            on {this.renderDateTime(this.state.dataStatus.lastUpdated)}</div>
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
