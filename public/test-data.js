var flow_1 = {
  "rules": [
    {
      "stats": {
        "created_on": "2021-07-26T13:57:08.849499+00:00"
      },
      "flow": 1,
      "id": 2,
      "text": "Lookup Response"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:08.862929+00:00"
      },
      "flow": 1,
      "id": 5,
      "text": "Lookup Webhook"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:08.858821+00:00"
      },
      "flow": 1,
      "id": 4,
      "text": "Lookup"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:08.844782+00:00"
      },
      "flow": 1,
      "id": 1,
      "text": "Comment"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:08.854672+00:00"
      },
      "flow": 1,
      "id": 3,
      "text": "Extra Comments"
    }
  ],
  "text": "Sample Flow - Order Status Checker",
  "stats": {
    "created_on": "2021-07-26T13:57:08.782887+00:00",
    "runs": 0
  },
  "id": 1
};
var flow_2 = {
  "rules": [
    {
      "stats": {
        "created_on": "2021-07-26T13:57:09.160861+00:00"
      },
      "flow": 2,
      "id": 6,
      "text": "Take Poll"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:09.196399+00:00"
      },
      "flow": 2,
      "id": 13,
      "text": "Extra Comments"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:09.165213+00:00"
      },
      "flow": 2,
      "id": 7,
      "text": "Shop Again"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:09.186778+00:00"
      },
      "flow": 2,
      "id": 11,
      "text": "Recommend"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:09.177858+00:00"
      },
      "flow": 2,
      "id": 9,
      "text": "Suggestion"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:09.172527+00:00"
      },
      "flow": 2,
      "id": 8,
      "text": "Gender"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:09.191328+00:00"
      },
      "flow": 2,
      "id": 12,
      "text": "Age"
    },
    {
      "stats": {
        "created_on": "2021-07-26T13:57:09.181765+00:00"
      },
      "flow": 2,
      "id": 10,
      "text": "Extra Comments"
    }
  ],
  "text": "Sample Flow - Satisfaction Survey",
  "stats": {
    "created_on": "2021-07-26T13:57:08.792262+00:00",
    "runs": 0
  },
  "id": 2
};
var flow_3 = {
  "rules": [
    {
      "stats": {
        "created_on": "2021-07-26T13:57:09.344419+00:00"
      },
      "flow": 3,
      "id": 14,
      "text": "Filter Working"
    }
  ],
  "text": "Sample Flow - Simple Poll",
  "stats": {
    "created_on": "2021-07-26T13:57:08.800850+00:00",
    "runs": 2
  },
  "id": 3
};
var flow_4 = {
  "rules": [
    {
      "stats": {
        "created_on": "2021-07-26T13:57:09.460754+00:00"
      },
      "flow": 4,
      "id": 15,
      "text": "optIn"
    }
  ],
  "text": "Sample Opt-in Flow",
  "stats": {
    "created_on": "2021-07-26T13:57:08.810310+00:00",
    "runs": 0
  },
  "id": 4
};

var test_data = {
  "org_supports_map": null,
  "reports": [
    {
      "text": "Another report",
      "public": false,
      "config": {
        "fields": [
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Lookup Response",
            "isVisible": true,
            "chartType": "pie",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 2}
          },
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Lookup Webhook",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 5}
          },
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Extra Comments",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 3}
          },
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Comment",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 1}
          },
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Extra Comments",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 2, "rule": 13}
          },
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Lookup",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 4}
          }
        ],
        "segments": [],
        "filters": []
      },
      "description": "-",
      "id": 2
    },
    {
      "text": "Lookup Report",
      "public": false,
      "config": {
        "fields": [
          {
            "showChoropleth": false,
            "chartSize": 1,
            "label": "Lookup Response",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 2}
          },
          {
            "showChoropleth": false,
            "chartSize": 1,
            "label": "Lookup Webhook",
            "isVisible": true,
            "chartType": "donut",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 5}
          },
          {
            "showChoropleth": false,
            "chartSize": 1,
            "label": "Lookup",
            "isVisible": true,
            "chartType": "column",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 4}
          },
          {
            "showChoropleth": false,
            "chartSize": 1,
            "label": "Comment",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 1}
          },
          {
            "showChoropleth": false,
            "chartSize": 1,
            "label": "Extra Comments",
            "isVisible": true,
            "chartType": "donut",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 3}
          },
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Recommend",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 2, "rule": 11}
          },
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Age",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 2, "rule": 12}
          }
        ],
        "segments": [
          {
            "isSegment": true,
            "isGroupSegment": true,
            "categories": [
              {
                "color": "#7cb5ec",
                "isSegment": false,
                "label": "Contacts"
              },
              {
                "color": "#434348",
                "isSegment": true,
                "label": "Survey Audience"
              }
            ],
            "label": "Contact Groups"
          },
          {
            "isSegment": false,
            "fieldId": 4,
            "isGroupSegment": false,
            "categories": [
              {
                "color": "#7cb5ec",
                "isSegment": true,
                "label": "Shipped"
              },
              {
                "color": "#434348",
                "isSegment": false,
                "label": "Pending"
              },
              {
                "color": "#90ed7d",
                "isSegment": true,
                "label": "Cancelled"
              }
            ],
            "label": "Lookup"
          }
        ],
        "filters": [
          {
            "isGroupFilter": false,
            "label": "Lookup",
            "showAllContacts": false,
            "isActive": true,
            "fieldId": 4,
            "categories": [
              {
                "isFilter": true,
                "label": "Shipped"
              },
              {
                "isFilter": false,
                "label": "Pending"
              },
              {
                "isFilter": true,
                "label": "Cancelled"
              }
            ]
          }
        ]
      },
      "description": "Defult description",
      "id": 3
    },
    {
      "text": "Simle Report",
      "public": false,
      "config": {
        "fields": [
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Filter Working",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 3, "rule": 14}
          }
        ],
        "segments": [],
        "filters": []
      },
      "description": "-jawdhajwhd",
      "id": 1
    },
    {
      "text": "jhdsfae",
      "public": false,
      "config": {
        "fields": [
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Lookup Webhook",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 1, "rule": 5}
          },
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "Recommend",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 2, "rule": 11}
          },
          {
            "showChoropleth": false,
            "chartSize": 2,
            "label": "optIn",
            "isVisible": true,
            "chartType": "bar",
            "showDataTable": false,
            "id": {"flow": 4, "rule": 15}
          }
        ],
        "segments": [],
        "filters": []
      },
      "description": "ajwhdjkahw",
      "id": 4
    }
  ],
  "current_report": null,
  "flows": [
    flow_1,
    flow_2,
    flow_3,
    flow_4,
  ],
  "available_flows": [
    flow_1,
    flow_2,
    flow_3,
    flow_4,
  ],
  "groups": [
    {
      "count": 2,
      "id": 8,
      "name": "Contacts"
    },
    {
      "count": 2,
      "id": 4,
      "name": "Survey Audience"
    }
  ],
  "endpoints": {
    "configureFlows": "",
    "createUpdateReport": "",
    "deleteReport": "",
    "loadChartsData": "",
    "refreshChartsData": "",
  },
  "data_status": {
    "lastUpdated": "2010-01-01", "completed": false, "progress": 0.21
  }
};
