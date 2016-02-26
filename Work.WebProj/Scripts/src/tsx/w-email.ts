namespace Email {
    interface BasicData {
        name: string,
        sex: boolean,
        email: string,
        tel: string,
        response: string
    }
    interface FaqData extends BasicData {
        car_class: string,
        license_plate_number: string,
        services: string,
        problem_class: Array<any>,
        content: string
    }
    interface UsedCarData extends BasicData {
        car_models: string;
        car_color: string;
        car_year: string;
        car_price: number;
        content: string;
    }
    interface LoginResult {
        result: boolean;
        message: string;
        url: string;
    }
    $("#SendEmail").submit(function (event) {
        event.preventDefault();
        let sendMailPath: string = "";
        let result: any;
        if (gb_id == EmailState.FAQ) {
            sendMailPath = gb_approot + 'FAQ/sendMail';
            let data: FaqData = {
                name: $("#m_name").val().replace(/<|>/g, ""),
                sex: $("[name='radio']:checked").val(),
                tel: $("#m_tel").val().replace(/<|>/g, ""),
                email: $("#m_email").val().replace(/<|>/g, ""),
                response: grecaptcha.getResponse(widgetId),
                car_class: $("#m_car_class").val().replace(/<|>/g, ""),
                license_plate_number: $("#m_license_plate_number").val().replace(/<|>/g, ""),
                services: $("#m_services").val().replace(/<|>/g, ""),
                problem_class: [],
                content: $("#m_faqcontent").val().replace(/<|>/g, "")
            };

            $("[name='problem']:checked").map((i, item) =>
                data.problem_class.push($(item).val())
            );
            if (data.problem_class.length <= 0) {
                alert("請選擇「問題種類」！");
                return;
            }
            result = data;
        } else if (gb_id == EmailState.UsedCar) {
            sendMailPath = gb_approot + 'UsedCar/sendMail';
            let data: UsedCarData = {
                name: $("#m_name").val().replace(/<|>/g, ""),
                sex: $("[name='radio']:checked").val(),
                tel: $("#m_tel").val().replace(/<|>/g, ""),
                email: $("#m_email").val().replace(/<|>/g, ""),
                response: grecaptcha.getResponse(widgetId),
                car_models: $("#m_car_models").val().replace(/<|>/g, ""),
                car_color: $("#m_car_color").val().replace(/<|>/g, ""),
                car_year: $("#m_car_year").val().replace(/<|>/g, ""),
                car_price: $("#m_car_price").val().replace(/<|>/g, ""),
                content: $("#m_usedcarcontent").val().replace(/<|>/g, "")
            };
            result = data;
        }
        if (sendMailPath != "") {
            $.ajax({
                type: "POST",
                url: sendMailPath,
                data: result,
                dataType: 'json'
            }).done(function (result: LoginResult, textStatus, jqXHRdata) {
                alert(result.message);
                grecaptcha.reset(widgetId);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            });
        }

    });
}

