### It's an analytics page component that was developed to use within the RapidPro app.

Connection example:
```html
<script>
    var context = JSON.parse('{{analytics_context|escapejs}}');
    context.endpoints = {
      createUpdateReport: "{% url 'reports.report_create' %}",
      deleteReport: "{% url 'reports.report_delete' %}",
      loadChartsData: "{% url 'reports.report_charts_data' %}",
      refreshChartsData: "{% url 'reports.report_update_charts_data' %}"
    };
    showAnalytics(document.querySelector("#analytics-container"), context);
</script>
```