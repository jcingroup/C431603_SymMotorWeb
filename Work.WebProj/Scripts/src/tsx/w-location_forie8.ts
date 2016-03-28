namespace Location_forie8 {
    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: gb_approot + 'BuyCar/GetLocation',
            data: {},
            dataType: 'json'
        }).done(function (result: { sales: server.Location[], repair: server.Location[] }, textStatus, jqXHRdata) {

            var data_sales: server.MapData[] = [];
            if (result.sales.length > 0) {
                for (var i = 0; i < result.sales.length; i++) {
                    data_sales.push({ title: result.sales[i].location_name, north: result.sales[i].north_coordinate, east: result.sales[i].east_coordinate, memo: result.sales[i].city + result.sales[i].country + result.sales[i].address, index: result.sales[i].location_id });
                    if (gb_type == LocationType.sales) {
                        var $tr = $('<tr />').appendTo('#tbody-content');
                        var $td_1 = $('<td />', { text: result.sales[i].city });
                        var $td_2 = $('<td />', { text: result.sales[i].country });
                        var $td_3 = $('<td />', { text: result.sales[i].city + result.sales[i].country + result.sales[i].address });
                        var $td_4 = $('<td />', { text: result.sales[i].tel });
                        var $td_5 = $('<td />', { html: result.sales[i].business_hours.replace(/\n/g, "<br/>") });
                        $tr.append($td_1, $td_2, $td_3, $td_4, $td_5);
                    }
                }
            }
            var data_repair: server.MapData[] = [];
            if (result.repair.length > 0) {
                for (var i = 0; i < result.repair.length; i++) {
                    data_repair.push({ title: result.repair[i].location_name, north: result.repair[i].north_coordinate, east: result.repair[i].east_coordinate, memo: result.repair[i].city + result.repair[i].country + result.repair[i].address, index: result.repair[i].location_id });
                    if (gb_type == LocationType.repair) {
                        var $tr = $('<tr />').appendTo('#tbody-content');
                        var $td_1 = $('<td />', { text: result.repair[i].city });
                        var $td_2 = $('<td />', { text: result.repair[i].country });
                        var $td_3 = $('<td />', { text: result.repair[i].city + result.repair[i].country + result.repair[i].address });
                        var $td_4 = $('<td />', { text: result.repair[i].tel });
                        var $td_5 = $('<td />', { html: result.repair[i].business_hours.replace(/\n/g, "<br/>") });
                        $tr.append($td_1, $td_2, $td_3, $td_4, $td_5);
                    }
                }
            }

            if (gb_type == LocationType.sales) {
                gb_map_data = data_sales;
            } else if (gb_type == LocationType.repair) { gb_map_data = data_repair }


        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        });

    });

}

