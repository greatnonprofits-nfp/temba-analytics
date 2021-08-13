import React, {createRef} from "react";
import "./SaveDialog.scss"
import {renderIf} from "../../utils";

interface SaveDialogProps {
  title?: string,
  description?: string,
  onSubmit?: (title: string, description: string) => any,
  onCancel?: () => any,
  show?: boolean;
  existingTitles: string[],
}

interface SaveDialogState {
  title: string,
  description: string,
  alertError: string,
  isOpen: boolean,
}

export default class SaveDialog extends React.Component<SaveDialogProps, SaveDialogState> {
  modalRef: any;
  titleRef: any;
  descriptionRef: any;

  constructor(props: SaveDialogProps) {
    super(props);
    this.state = {
      title: !!this.props.title ? this.props.title: "",
      description: !!this.props.description ? this.props.description: "",
      alertError: "",
      isOpen: !!this.props.show,
    };
    this.modalRef = createRef();
    this.titleRef = createRef();
    this.descriptionRef = createRef();
  }

  componentWillReceiveProps(nextProps: SaveDialogProps) {
    let extra: any = {};
    if (nextProps.title !== this.state.title || nextProps.description !== this.state.description) {
      extra["title"] = nextProps.title;
      extra["description"] = nextProps.description;
    }
    this.setState({isOpen: !!nextProps.show, ...extra});
    this.modalRef.current.open = !!nextProps.show;
  }

  componentDidMount() {
    this.titleRef.current.addEventListener("change", this.handleTitleChanged.bind(this));
    this.descriptionRef.current.addEventListener("change", this.handleDescriptionChanged.bind(this));
    this.modalRef.current.addEventListener("temba-button-clicked", this.handleDialogButtonClicked.bind(this));
    this.modalRef.current.open = this.state.isOpen;
  }

  componentWillUnmount() {
    this.titleRef.current.removeEventListener("change", this.handleTitleChanged.bind(this));
    this.descriptionRef.current.removeEventListener("change", this.handleDescriptionChanged.bind(this));
    this.modalRef.current.removeEventListener("temba-button-clicked", this.handleDialogButtonClicked.bind(this));
  }

  private handleTitleChanged() {
    this.setState({title: this.titleRef.current.value, alertError: ""});
  }

  private handleDescriptionChanged() {
    this.setState({description: this.descriptionRef.current.value, alertError: ""});
  }

  private handleDialogButtonClicked(evt: any) {
    if (!evt.detail.button.secondary && !!this.props.onSubmit) {
      if (this.state.title.length === 0) {
        this.setState({alertError: "Title is not provided."});
        return;
      }
      if (this.props.existingTitles.find(title => title === this.state.title)) {
        this.setState({alertError: "Report with this title already exists."});
        return;
      }
      this.props.onSubmit(this.state.title, this.state.description);
    }
    if (!!this.props.onCancel) this.props.onCancel();
  }

  render() {
    return <temba-dialog
      ref={this.modalRef}
      header={"Save Report"}
      primaryButtonName={"Save Report"}
      hideOnClick={false}
    >
      <div className="p-6 body">
        {renderIf(this.state.alertError.length !== 0)(
          <div className={"alert-error"}>{this.state.alertError}</div>
        )}
        <div className="report-title">
          <label>Title</label>
          <temba-textinput
            ref={this.titleRef}
            placeholder={"The title of this report"}
            value={this.state.title}
          />
        </div>
        <div className="report-description">
          <label>Description</label>
          <temba-textinput
            ref={this.descriptionRef}
            placeholder={"The full description for the report"}
            value={this.state.description}
            textarea={true}
          />
        </div>
      </div>
    </temba-dialog>;
  }
}