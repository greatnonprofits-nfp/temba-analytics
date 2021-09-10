import React, {createRef} from "react";
import {Flow} from "../../utils/types";
import Select from "react-select";
import "./FlowsDialog.scss"
import {getRequestHeaders, renderIf} from "../../utils";
import axios from "axios";


interface FlowsDialogProps {
  isVisible: boolean,
  selectedFlows: Flow[],
  allFlows: Flow[],
  onSuccess?: () => any,
  onCancel?: () => any,
  submitUrl: string,
}

interface FlowsDialogState {
  availableFlows: { label: string, value: any }[]
  selectedFlows: { label: string, value: any }[],
  errorAlert: string
}

export default class FlowsDialog extends React.Component<FlowsDialogProps, FlowsDialogState> {
  modalRef: any;

  public constructor(props: FlowsDialogProps) {
    super(props);
    let allFlowIds = this.props.selectedFlows.map(flow => flow.id);
    this.state = {
      selectedFlows: this.props.allFlows.filter(flow => allFlowIds.includes(flow.id)).map(FlowsDialog.flowToSelectItemConvertor),
      availableFlows: this.props.allFlows.map(FlowsDialog.flowToSelectItemConvertor),
      errorAlert: "",
    };
    this.modalRef = createRef();
  }

  componentWillReceiveProps(nextProps: Readonly<FlowsDialogProps>) {
    this.modalRef.current.open = nextProps.isVisible;
  }

  componentDidMount() {
    this.modalRef.current.open = this.props.isVisible;
    this.modalRef.current.hideOnClick = false;
    this.modalRef.current.handleClick = (evt: any) => {
      const button: any = evt.currentTarget;
      if (!button.disabled && !this.modalRef.current.submitting) {
        if (button.primary) {
          if (this.state.selectedFlows.length > 0) {
            this.modalRef.current.submitting = true;
            axios.post(
              this.props.submitUrl,
              {flows: this.state.selectedFlows.map(option => option.value)},
              {headers: getRequestHeaders()},
            ).then(_ => {
              if (!!this.props.onSuccess) this.props.onSuccess();
            }).catch(() => {
              this.setState({errorAlert: "Something went wrong. Please try again later."});
              setTimeout(() => {
                if (!!this.props.onCancel) this.props.onCancel()
              }, 3000);
            });
          } else {
            this.setState({errorAlert: "Please select at least one flow to proceed"});
          }
        } else {
          if (!!this.props.onCancel) {
            this.props.onCancel();
          }
        }
      }
    };
  }

  private static flowToSelectItemConvertor(flow: Flow) {
    return {
      label: flow.text,
      value: flow.id,
    }
  }

  render() {
    return <temba-dialog
      ref={this.modalRef}
      header={"Add flows to get report"}
      primaryButtonName={"Save"}
      cancelButtonName={"Cancel"}
    >
      <div className="p-6 body">
        {renderIf(this.state.errorAlert.length !== 0)(
          <div className={"error-alert"}>{this.state.errorAlert}</div>
        )}
        <div className={"flows-title"}>Flows</div>
        <Select
          isMulti
          searchable={true}
          placeholder={"Select the flows"}
          styles={{
            multiValue: (provided: any) => ({
              ...provided,
              display: "flex",
              flexDirection: "row-reverse",
            }),
            multiValueLabel: (provided: any) => ({
              ...provided,
              padding: "5px",
            }),
            multiValueRemove: (provided: any) => ({
              ...provided,
              color: "#bebebe",
              cursor: "pointer",
              display: "inline-block",
              padding: "5px",
              lineHeight: "10px",
              borderRight: "1px solid rgba(100, 100, 100, 0.2)",
              margin: "0px",
              background: "rgba(100, 100, 100, 0.05)",
              "&:hover": {
                color: "#bebebe",
                background: "rgba(100, 100, 100, 0.1)",
              }
            }),
            menu: (provided: any) => ({
              ...provided,
              position: "inherit",
            }),
            control: (provided: any) => ({
              ...provided,
              "&:focus-within": {
                borderColor: "var(--color-focus)",
                background: "var(--color-widget-bg-focused)",
                boxShadow: "var(--widget-box-shadow-focused)",
              }
            }),
          }}
          options={this.state.availableFlows}
          value={this.state.selectedFlows}
          onChange={(selectedFlows: any) => {
            this.setState({selectedFlows, errorAlert: ""});
          }}
        />
        <div className={"flows-help"}>Select the flows that you want to see the data on the analytics page</div>
      </div>
    </temba-dialog>
  }
}