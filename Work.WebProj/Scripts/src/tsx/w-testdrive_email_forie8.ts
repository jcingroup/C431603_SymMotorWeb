namespace TestDrive_forie8 {
    interface BasicData {
        name: string,
        sex: boolean,
        email: string,
        tel: string,
        response: string
    }
    interface TestDriveData extends BasicData {

        type?: number;//分 試乘:2 賞車:4

        car_models?: string;//試乘車款 賞車車款
        car_models_name?: string;
        contact_time?: string;//聯繫時間
        //看車時間
        view_year?: number;//年
        view_month?: number;//月
        view_day?: number;//日
        view_time?: string;//時
        //看車地點
        view_city?: string;//縣市
        view_location?: number;//營業點
        view_location_name?: string;
        //checkbox
        is_edm?: boolean;
        is_agree?: boolean;
    }
    interface LoginResult {
        result: boolean;
        message: string;
        url: string;
    }
    function checkLeapYear(Year: number): boolean {
        if (Year % 4 == 0) {
            if (Year % 100 == 0) {
                if (Year % 400 == 0) {
                    return true;//可以被100整除又可以被400整除
                } else {
                    return false;//可以被100整除但無法被400整除
                }
            } else {
                return true;//被4整除但無法被100整除
            }
        } else {//無法被4整除
            return false;
        }
    }
    $(document).ready(function () {
        var car_models: server.L1[] = [];//試乘車款 賞車車款
        var all_location: server.GroupOption[] = [];//營業點
        //---年---
        var year_rang: server.Option[] = [{ val: (new Date()).getFullYear(), Lname: (new Date()).getFullYear() + '年' },
            { val: (new Date()).getFullYear() + 1, Lname: ((new Date()).getFullYear() + 1) + '年' }];
        for (var i = 0; i < year_rang.length; i++) {
            $('#m_view_year').append($('<option />', {
                text: year_rang[i].Lname,
                value: year_rang[i].val
            }));
        }
        //---年---
        //---試乘日期---一開始載入為一月
        for (var i = 1; i <= 31; i++) {
            $('#m_view_day').append($('<option />', {
                text: i + '日',
                value: i
            }));
        }     
        //---試乘日期---
        $.ajax({
            type: "GET",
            url: gb_approot + 'TestDrive/GetInitData',
            data: {},
            dataType: 'json'
        }).done(function (result: { brands: server.L1[], locations: server.GroupOption[] }, textStatus, jqXHRdata) {
            car_models = result.brands;
            all_location = result.locations;
            if (car_models.length > 0) {
                for (var i = 0; i < car_models.length; i++) {
                    var $group = $('<optgroup />', { label: car_models[i].l1_name, 'class': 'text-muted' }).appendTo('#m_car_models');
                    for (var j = 0; j < car_models[i].l2_list.length; j++) {
                        var option = $('<option />', {
                            text: car_models[i].l2_list[j].l2_name,
                            value: car_models[i].l2_list[j].l2_id,
                            'class': 'text-info'
                        });
                        option.data('l1', car_models[i].l1_id);
                        $group.append(option);
                    }
                }
            }
            if (all_location.length > 0) {
                for (var i = 0; i < all_location.length; i++) {
                    $('#m_view_city').append($('<option />', {
                        text: all_location[i].key,
                        value: all_location[i].key
                    }));
                }
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        });

        $("#m_view_month").change(function () {
            var month_day: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var select_year: number = $("#m_view_year option:selected").val();//目前選擇的年份
            var select_month: number = $("#m_view_month option:selected").val();//目前選擇的月份
            var last_day: number = $("#m_view_day option:last-child").val();//目前月份總天數
            var days: number = month_day[select_month - 1];
            if (checkLeapYear(select_year) && select_month == 2) {//如果閏年2月變29天
                days = 29;
            }
            if (last_day != days) {
                $("#m_view_day").empty();//or $("#m_view_day").find("option").remove();
                for (var i = 1; i <= days; i++) {
                    $('#m_view_day').append($('<option />', {
                        text: i + '日',
                        value: i
                    }));
                }
            }
        });
        $("#m_view_city").change(function () {
            var view_location: server.Location[] = [];
            var select_city: string = $("#m_view_city option:selected").val();
            for (var i = 0; i < all_location.length; i++) {
                if (select_city == all_location[i].key) {
                    view_location = all_location[i].locations;
                    break;
                }
            }
            $("#m_view_location").empty();
            $('#m_view_location').append($('<option />', {
                text: '選擇營業所',
                value: "",
                disabled: true
            }));
            for (var i = 0; i < view_location.length; i++) {
                $('#m_view_location').append($('<option />', {
                    text: view_location[i].location_name,
                    value: view_location[i].location_id
                }));
            }
        });

        $("#SendEmail").submit(function (event) {
            event.preventDefault();
            let sendMailPath: string = gb_approot + 'TestDrive/sendMail';
            let data: TestDriveData = {
                name: $("#m_name").val().replace(/<|>/g, ""),
                sex: $("[name='radio']:checked").val(),
                tel: $("#m_tel").val().replace(/<|>/g, ""),
                email: $("#m_email").val().replace(/<|>/g, ""),
                response: grecaptcha.getResponse(widgetId),
                car_models: $("#m_car_models option:selected").val(),
                car_models_name: $("#m_car_models option:selected").text(),
                contact_time: $("#m_contact_time option:selected").val(),
                view_year: $("#m_view_year option:selected").val(),
                view_month: $("#m_view_month option:selected").val(),
                view_day: $("#m_view_day option:selected").val(),
                view_time: $("#m_view_time option:selected").val(),
                view_city: $("#m_view_city option:selected").val(),
                view_location: $("#m_view_location option:selected").val(),
                view_location_name: $("#m_view_location option:selected").text(),
                is_edm: $('#checkbox2').prop("checked"),
                is_agree: false,
                type: gb_type
            };
            if (sendMailPath != "") {
                $.ajax({
                    type: "POST",
                    url: sendMailPath,
                    data: data,
                    dataType: 'json'
                }).done(function (result: LoginResult, textStatus, jqXHRdata) {
                    alert(result.message);
                    grecaptcha.reset(widgetId);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                });
            }

        });
    });

}

