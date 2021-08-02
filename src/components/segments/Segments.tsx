import React from "react";
import {ReportSegment, SegmentCategory} from "../../utils/types";
import {renderIf} from "../../utils";
import CheckBox from "../checkbox/CheckBox";
import "./Segments.scss"


interface SegmentsProps {
  segments: ReportSegment[],
  onUpdateSegment?: (idx: number, segment: ReportSegment) => any,
  onDeleteSegment?: (idx: number) => any;
}

interface SegmentsState {
}


export default class Segments extends React.Component<SegmentsProps, SegmentsState> {
  constructor(props: SegmentsProps) {
    super(props);
    this.state = {};
  }

  private handleSegmentChecked(segment: ReportSegment, segmentIdx: number, categoryIdx: number) {
    if (!!this.props.onUpdateSegment) {
      segment.categories.forEach((category: SegmentCategory, idx) => {
        category.isSegment = categoryIdx === idx ? !category.isSegment : category.isSegment;
      });
      this.props.onUpdateSegment(segmentIdx, segment);
    }
  }

  render() {
    if (this.props.segments.length === 0) return <></>;
    return <div className={"segments-container"}>
      <div className="title">Segment Variable</div>
      <div className="inner-scroll">
        {this.props.segments.map((segment: ReportSegment, idx) => (
          <div key={idx} className={"segment-item" + (segment.isSegment ? "" : " inactive")}>
            <div className="segment-header">
              <i className="fab fa-buffer icon" onClick={() => {
                if (!!this.props.onUpdateSegment) {
                  segment.isSegment = !segment.isSegment;
                  this.props.onUpdateSegment(idx, segment);
                }
              }}></i>
              <div className="label">{segment.label}</div>
              <i className="fa fa-trash remove" onClick={() => {
                if (!!this.props.onDeleteSegment) this.props.onDeleteSegment(idx)
              }}></i>
            </div>

            {renderIf(segment.isSegment)(
              <ul className="segment-categories">
                {segment.categories.map((category: SegmentCategory, categoryIdx) => (<li key={categoryIdx}>
                  <CheckBox checked={category.isSegment} onChecked={() => {
                    this.handleSegmentChecked(segment, idx, categoryIdx)
                  }} label={category.label}></CheckBox>
                </li>))}
              </ul>
            )}
          </div>))
        }
      </div>
    </div>
  }
}