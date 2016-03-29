namespace Loan_Email_forie8 {
    interface BasicData {
        name: string,
        sex: boolean,
        email: string,
        tel: string,
        response: string
    }
    interface LoanData extends BasicData {
        //loan
        loan_project?: string;
        //new
        car_models?: string;//購買車型
        car_price?: number;//車輛牌價
        down_payment?: number;//頭款
        loan_price?: number;//貸款金額
        installments?: number;//分期付款 期繳
        rate?: number;//利率
        monthly_payment?: number;//月付款
        //used
        license_plate_number?: string;//車牌號碼
        car_brand?: string;//車輛廠牌
        car_year?: number;//出廠年份
        car_month?: number;//出場月份
    }
    interface LoginResult {
        result: boolean;
        message: string;
        url: string;
    }

    $(document).ready(function () {

        $("#m_loan_project").change(function () {
            $("#loan-content").empty();
            var $div = $('<div />').appendTo('#loan-content');
            var select_val = $("#m_loan_project").val();
            if (select_val == "新車購車分期") {
                var $div_1 = $('<div />', { 'class': "col-xs-12 col-sm-6" })
                    .append($('<div />', { 'class': "form-group" }).append("<label  class='control-label'>購買車型 <small class='text-danger'>*</small></label><input type='text' class='form-control c-input' id='m_car_models' required>"));//購買車型
                var $div_2 = $('<div />', { 'class': "col-xs-12 col-sm-6" })
                    .append($('<div />', { 'class': "form-group" }).append("<label  class='control-label'>車輛牌價</label><div class='input-group'><span class='input-group-addon'>$</span><input type='number' class='form-control c-input' id='m_car_price' required><span class='input-group-addon'>(未扣除貨物稅)</span></div>"));//車輛牌價
                var $div_3 = $('<div />', { 'class': "col-xs-6 col-sm-3" })
                    .append($('<div />', { 'class': "form-group" }).append("<label class='control-label'>頭款 <small class='text-danger'>*</small></label><div class='input-group'><span class='input-group-addon' >$</span><input type='number' class='form-control c-input' id='m_down_payment' required></div>"));//頭款
                var $div_4 = $('<div />', { 'class': "col-xs-6 col-sm-3" })
                    .append($('<div />', { 'class': "form-group" }).append("<label class='control-label'>貸款金額</label><div class='input-group'><span class='input-group-addon' >$</span><input type='number' class='form-control c-input' id='m_loan_price'></div>"));//貸款金額
                var $div_5 = $('<div />', { 'class': "col-xs-6 col-sm-2" })
                    .append($('<div />', { 'class': "form-group" }).append("<label class='control-label'>期繳 <small class='text-danger'>*</small></label><div class='input-group'><span class='input-group-addon' >$</span><input type='number' class='form-control c-input' id='m_installments' required></div>"));//期繳
                var $div_6 = $('<div />', { 'class': "col-xs-6 col-sm-2" })
                    .append($('<div />', { 'class': "form-group" }).append("<label class='control-label'>利率 <small class='text-danger'>*</small></label><div class='input-group'><input type='number' class='form-control c-input' id='m_rate' required><span class='input-group-addon'>%</span></div>"));//利率
                var $div_7 = $('<div />', { 'class': "col-xs-6 col-sm-2" })
                    .append($('<div />', { 'class': "form-group" }).append("<label class='control-label'>月付款</label><div class='input-group'><span class='input-group-addon' >$</span><input type='number' class='form-control c-input' id='m_monthly_payment'></div>"));//月付款
                $div.append($div_1, $div_2, $div_3, $div_4, $div_5, $div_6, $div_7);
            } else if (select_val == "中古車貸款申請") {
                var $div_1 = $('<div />', { 'class': "col-xs-6 col-sm-3" })
                    .append($('<div />', { 'class': "form-group" }).append("<label  class='control-label'>車牌號碼 <small class='text-danger'>*</small></label><input type='text' class='form-control c-input' id='m_license_plate_number' required>"));//車牌號碼
                var $div_2 = $('<div />', { 'class': "col-xs-6 col-sm-3" })
                    .append($('<div />', { 'class': "form-group" }).append("<label  class='control-label'>車輛廠牌 <small class='text-danger'>*</small></label><input type='text' class='form-control c-input' id='m_car_brand' required>"));//車輛廠牌
                var $div_3 = $('<div />', { 'class': "col-xs-6 col-sm-3" })
                    .append($('<div />', { 'class': "form-group" }).append("<label  class='control-label'>車型 <small class='text-danger'>*</small></label><input type='text' class='form-control c-input' id='m_car_models' required>"));//車型
                var $div_4 = $('<div />', { 'class': "col-xs-6 col-sm-3" })
                    .append($('<div />', { 'class': "form-group" }).append("<label  class='control-label'>出廠年份</label><div class='row'><div class='col-xs-6'><div class='input-group'><input type='number' class='form-control c-input' id='m_car_year'><span class='input-group-addon' >年</span></div></div><div class='col-xs-6'><div class='input-group'><input type='number' class='form-control c-input' id='m_car_month' ><span class='input-group-addon' >月</span></div></div></div>"));//出廠年份
                $div.append($div_1, $div_2, $div_3, $div_4);
            }


        });

        $("#SendEmail").submit(function (event) {
            event.preventDefault();
            let sendMailPath: string = gb_approot + 'Loan/sendMail';
            let data: LoanData = {
                name: $("#m_name").val().replace(/<|>/g, ""),
                sex: $("[name='radio']:checked").val(),
                tel: $("#m_tel").val().replace(/<|>/g, ""),
                email: $("#m_email").val().replace(/<|>/g, ""),
                response: grecaptcha.getResponse(widgetId),
                loan_project: $("#m_loan_project").val(),
                car_models: $("#m_car_models").val(),
                car_price: $("#m_car_price").val(),
                down_payment: $("#m_down_payment").val(),
                loan_price: $("#m_loan_price").val(),
                installments: $("#m_installments").val(),
                rate: $("#m_rate").val(),
                monthly_payment: $("#m_monthly_payment").val(),
                license_plate_number: $("#m_license_plate_number").val(),
                car_brand: $("#m_car_brand").val(),
                car_year: $("#m_car_year").val(),
                car_month: $("#m_car_month").val()
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

