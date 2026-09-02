jQuery(function ($) {
	$("#ali-draft-publish-btn").on("click", function () {
		$.post(ajaxurl, { action: "pub_ali_draft_prod" }, function () {
			alert("Products Published Successfuly");
			window.location.reload();
		});
	});

	var chartElement = document.getElementById("bar-chart-grouped");

	if (!chartElement || typeof Chart === "undefined") {
		return;
	}

	var orderMeta = window.last_day_orders || {};
	var orderTotals = window.last_day_orders_data || {};
	var profitTotals = window.profit || {};
	var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

	function monthToName(monthInNumber) {
		return monthNames[parseInt(monthInNumber, 10) - 1] || "";
	}

	function last7Days() {
		var days = Array.isArray(orderMeta.last7days) ? orderMeta.last7days : [];
		var months = Array.isArray(orderMeta.active_months) ? orderMeta.active_months : [];
		var result = [];

		for (var i = 0; i < 7; i++) {
			result.push((days[i] || "") + " " + monthToName(months[i]));
		}

		return result.reverse();
	}

	function last7DaysOrders(lastOrders) {
		var days = Array.isArray(orderMeta.last7days) ? orderMeta.last7days : [];
		var result = [];

		for (var i = 0; i < 7; i++) {
			var day = days[i];
			var total = lastOrders && lastOrders[day] ? parseFloat(lastOrders[day]) : 0;
			result.push(isNaN(total) ? 0 : total);
		}

		return result.reverse();
	}

	Chart.defaults.global.defaultFontColor = "white";
	Chart.defaults.global.defaultFontSize = 16;

	new Chart(chartElement, {
		type: "bar",
		data: {
			labels: last7Days(),
			datasets: [
				{
					label: "Orders Total in " + (orderMeta.currency || ""),
					backgroundColor: "#ff7789",
					data: last7DaysOrders(orderTotals)
				},
				{
					label: "Profit",
					backgroundColor: "#21e2ae",
					data: last7DaysOrders(profitTotals)
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false
		}
	});
});
