// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

async function getCasesStatusData(){
  try {
    const res = await fetch("/overview/charts/cases")
    const data = await res.json();
    return data
  } catch (error) {
    return null
  }
}

getCasesStatusData().then(data => {

const chartLabels = ["Resolved", "Active"];
const activeCasesTotal = data.cases.active_total || 0;
const resolvedCasesTotal = data.cases.resolved_total || 0;

// Pie Chart Example
var ctx = document.getElementById("myPieChart");
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: chartLabels,
    datasets: [{
      data: [activeCasesTotal, resolvedCasesTotal],
      backgroundColor: ['#36b9cc', '#f6c23e'],
      hoverBackgroundColor: ['#369acc', '#f6ac3e'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});

})