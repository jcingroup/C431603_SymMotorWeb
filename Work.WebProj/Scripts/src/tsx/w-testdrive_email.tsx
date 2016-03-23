import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import DT = require('dt');

namespace TestDriveEmail {
    interface LoanData {
        //basic
        name?: string,
        sex?: boolean,
        email?: string,
        tel?: string,
        response?: string

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
    interface EmailResult {
        result: boolean;
        message: string;
    }
    interface FormState {
        fieldData?: LoanData,
        car_models?: server.L1[],
        all_location?: server.GroupOption[],
        view_location?: server.Location[],
        year_rang?: server.Option[],
        days_rang?: server.Option[],
        pos?: any;
    }
    interface Formprops {
        apiPath?: string;
        apiInitPath?: string;
        months?: server.Option[];
        month_day?: number[];
    }
    export class GridForm extends React.Component<Formprops, FormState>{

        constructor() {

            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.changeInputVal = this.changeInputVal.bind(this);
            this.onCityChange = this.onCityChange.bind(this);
            this.onMonthChange = this.onMonthChange.bind(this);
            this.listdays = this.listdays.bind(this);
            this.checkLeapYear = this.checkLeapYear.bind(this);
            this.setMapData = this.setMapData.bind(this);
            this.render = this.render.bind(this);


            this.state = {
                fieldData: { view_city: "", contact_time: "上午 8: 00~12: 00", view_time: "8:00~10:00", type: gb_type, is_edm: false, is_agree: false },
                car_models: [],
                all_location: [],
                view_location: [],
                year_rang: [{ val: (new Date()).getFullYear(), Lname: (new Date()).getFullYear() + '年' },
                    { val: (new Date()).getFullYear() + 1, Lname: ((new Date()).getFullYear() + 1) + '年' }],
                days_rang: [],
                pos: null
            }
        }
        static defaultProps: Formprops = {
            apiPath: gb_approot + 'TestDrive/sendMail',
            apiInitPath: gb_approot + 'TestDrive/GetInitData',
            months: [
                { val: 1, Lname: '1月' },
                { val: 2, Lname: '2月' },
                { val: 3, Lname: '3月' },
                { val: 4, Lname: '4月' },
                { val: 5, Lname: '5月' },
                { val: 6, Lname: '6月' },
                { val: 7, Lname: '7月' },
                { val: 8, Lname: '8月' },
                { val: 9, Lname: '9月' },
                { val: 10, Lname: '10月' },
                { val: 11, Lname: '11月' },
                { val: 12, Lname: '12月' }
            ],
            month_day: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        }
        componentDidMount() {
            this.queryInitData();
        }
        queryInitData() {
            CommFunc.jqGet(this.props.apiInitPath, {})
                .done((data, textStatus, jqXHRdata) => {
                    this.setMapData(1, data.locations, this.state.pos);
                    this.setState({ car_models: data.brands, all_location: data.locations });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        handleSubmit(e: React.FormEvent) {
            e.preventDefault();
            this.state.fieldData.response = grecaptcha.getResponse(widgetId);
            //if (this.state.fieldData.type == EmailState.TestDrive && !this.state.fieldData.is_agree) {
            //    alert("需同意試乘條款之內容，才可預約試乘！");
            //    return;
            //}

            CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                .done((data: EmailResult, textStatus, jqXHRdata) => {
                    alert(data.message);
                    grecaptcha.reset(widgetId);
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
            return;
        }
        changeInputVal(name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.fieldData
            if (input.value == 'true') {
                obj[name] = true;
            } else if (input.value == 'false') {
                obj[name] = false;
            } else {
                obj[name] = input.value;
            }
            if (name == "view_location") {
                obj['view_location_name'] = $("#view_location option:selected").text();
            } else if (name == "car_models") {
                obj['car_models_name'] = $("#car_models option:selected").text();
            }
            this.setState({ fieldData: obj });
        }
        onCityChange(name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.fieldData;
            let pos: any = null;
            let locations: server.Location[] = [];
            for (var i in this.state.all_location) {
                var item = this.state.all_location[i];
                if (item.key == input.value) {
                    locations = item.locations;
                    break;
                }
            }

            obj['view_city'] = input.value;
            if (locations.length > 0) {
                obj['view_location'] = locations[0].location_id;
                obj['view_location_name'] = locations[0].location_name;
                pos = { lat: locations[0].north_coordinate, lng: locations[0].east_coordinate };
            }

            this.setMapData(2, locations, pos);
            this.setState({ fieldData: obj, view_location: locations, pos: pos });
        }
        onMonthChange(name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.fieldData;
            this.listdays(parseInt(input.value));
            obj['view_month'] = parseInt(input.value);
            this.setState({ fieldData: obj });
        }
        listdays(value: number) {
            let month_day: number = this.props.month_day[value - 1];//判斷這個月總共有幾天

            if (this.checkLeapYear(this.state.fieldData.view_year) && value == 2) {//如果閏年2月變29天
                month_day = 29;
            }
            let day: server.Option[] = [];
            for (var i = 1; i <= month_day; i++) {
                day.push({ val: i, Lname: i + '日' });
            }
            this.setState({ days_rang: day });
        }

        checkLeapYear(Year) {
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
        setMapData(type: number, all: any[], pos: any) {
            let data: server.MapData[] = [];
            if (type == 1) {//all
                all.forEach((all_item, i) => {
                    all_item.locations.forEach((item, j) => {
                        data.push({ title: item.location_name, north: item.north_coordinate, east: item.east_coordinate, memo: item.city + item.country + item.address, index: item.location_id })
                    });
                });
                gb_map_data = data;
            } else if (type == 2) {//location
                all.forEach((item, i) => data.push({ title: item.location_name, north: item.north_coordinate, east: item.east_coordinate, memo: item.city + item.country + item.address, index: item.location_id }));
                gb_map_data = data;
                setNewMapMarker(0, pos);
            }
        }
        changeCheckBoxVal(name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.fieldData;
            if (input.checked) {
                obj[name] = true;
            } else if (!input.checked) {
                obj[name] = false;
            }
            console.log(obj);
            this.setState({ fieldData: obj });
        }
        render() {

            var outHtml: JSX.Element = null;
            let fieldData = this.state.fieldData;
            let car_models = this.state.car_models;
            let view_location = this.state.view_location;

            let car_models_html: JSX.Element = null;//試乘車款 賞車車款
            let view_days_html: JSX.Element = null;//希望試乘日期 希望賞車日期
            let view_location_html: JSX.Element = null;//試乘據點 賞車據點
            let is_argee_html: JSX.Element = null;//同意試車條款

            if (gb_type == EmailState.TestDrive) {
                car_models_html = <label className="control-label">試乘車款 <small className="text-danger">*</small></label>;
                view_days_html = <label className="control-label">希望試乘日期 <small className="text-danger">*</small></label>;
                view_location_html = <label className="control-label">試乘據點 <small className="text-danger">*</small></label>;
                is_argee_html = (<label className="c-input c-checkbox">
                                    <input id="checkbox1" name="checkbox" type="checkbox"
                                        value={fieldData.is_agree} onChange={this.changeCheckBoxVal.bind(this, 'is_agree') }/>
                                    <span className="c-indicator"><i className="ti-check"></i></span>
                                    我已閱讀並同意 <a href="">試乘條款</a>
                    </label>);
            } else if (gb_type == EmailState.BuyCar) {
                car_models_html = <label className="control-label">賞車車款 <small className="text-danger">*</small></label>;
                view_days_html = <label className="control-label">希望賞車日期 <small className="text-danger">*</small></label>;
                view_location_html = <label className="control-label">賞車據點 <small className="text-danger">*</small></label>;
            }


            outHtml = (
                <div>
                    <h5 className="h5">請填妥以下基本資料，我們將有專人為您處理。</h5>
                    <hr />

                    <form action="" className="form" onSubmit={this.handleSubmit} >
                         <div className="row">
                            <div className="col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label  className="control-label">姓名 <small className="text-danger">*</small></label>
                                    <input type="text" id="m_name" className="form-control c-input" required
                                        value={fieldData.name} onChange={this.changeInputVal.bind(this, 'name') }/>
                                    </div>
                                </div>

                        <div className="col-sm-6 col-xs-12">
                            <div className="form-group">
                                <label  className="control-label">性別 <small className="text-danger">*</small></label>
                                <div className="c-radio-group">
                                    <label className="c-input c-radio">
                                        <input id="radio1" name="sex" type="radio"
                                            value={true}
                                            checked={fieldData.sex === true}
                                            onChange={this.changeInputVal.bind(this, 'sex') }
                                            required />
                                        <span className="c-indicator">男</span>
                                        </label>
                                    <label className="c-input c-radio">
                                        <input id="radio2" name="sex" type="radio"
                                            value={false}
                                            checked={fieldData.sex === false}
                                            onChange={this.changeInputVal.bind(this, 'sex') }
                                            required />
                                        <span className="c-indicator">女</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                        <div className="col-sm-6 col-xs-12">
                            <div className="form-group">
                                <label  className="control-label">E-mail <small className="text-danger">*</small></label>
                                <input type="email" id="m_email" className="form-control c-input" required
                                    value={fieldData.email} onChange={this.changeInputVal.bind(this, 'email') }   />
                                </div>
                            </div>

                        <div className="col-sm-6 col-xs-12">
                            <div className="form-group">
                                <label className="control-label">連絡電話 <small className="text-danger">*</small></label>
                                <input type="tel" id="m_tel" className="form-control c-input" required
                                    value={fieldData.tel} onChange={this.changeInputVal.bind(this, 'tel') } />
                                </div>
                            </div>



                        <div className="col-sm-6 col-xs-12">
                            <div className="form-group">
                                {car_models_html}
                                <select name="car_models" id="car_models" className="form-control c-select"
                                    value={fieldData.car_models} onChange={this.changeInputVal.bind(this, 'car_models') } required>
                                    <option value="" defaultValue="" disabled>請選擇</option>
                                        {
                                        car_models.map((l1, i) => <optgroup key={'l1-' + i} className="text-muted" label={l1.l1_name}>
                                            {
                                            l1.l2_list.map((l2, j) => <option key={'l2-' + j} className="text-info" value={l2.l2_id}>{l2.l2_name}</option>)
                                            }
                                            </optgroup>)
                                        }
                                    </select>
                                </div>
                            </div>

                        <div className="col-sm-6 col-xs-12">
                            <div className="form-group">
                                <label  className="control-label">客服人員聯繫時間</label>
                                <select name="" id="" className="form-control c-select"
                                    value={fieldData.contact_time} onChange={this.changeInputVal.bind(this, 'contact_time') }>
                                    <option value="上午 8: 00~12: 00">上午 8: 00~12: 00</option>
                                    <option value="下午 12: 00~16: 00">下午 12: 00~16: 00</option>
                                    <option value="下午 16: 00 以後">下午 16: 00 以後</option>
                                    </select>
                                </div>
                            </div>

                        <div className="col-xs-12">
                            <div className="form-group">
                            {view_days_html}

                            <div className="row">
                                <div className="col-md-3 col-sm-4 col-xs-12">
                                    <select name="" id="" className="form-control c-select gutter-xs-down"
                                        value={fieldData.view_year} onChange={this.changeInputVal.bind(this, 'view_year') } required>
                                        <option value="" defaultValue="">請選擇年份</option>
                                        {
                                        this.state.year_rang.map((item, i) => <option key={i} value={item.val}>{item.Lname}</option>)
                                        }
                                        </select>
                                    </div>
                                <div className="col-md-3 col-sm-4 col-xs-6">
                                    <select name="" id="" className="form-control c-select"
                                        value={fieldData.view_month} onChange={this.onMonthChange.bind(this, 'view_month') } required>
                                        <option value="" defaultValue="">請選擇月份</option>
                                        {
                                        this.props.months.map((item, i) => <option key={i} value={item.val}>{item.Lname}</option>)
                                        }
                                        </select>
                                    </div>
                                <div className="col-md-3 col-sm-4 col-xs-6">
                                    <select name="" id="" className="form-control c-select"
                                        value={fieldData.view_day} onChange={this.changeInputVal.bind(this, 'view_day') } required>
                                        <option value="" defaultValue="">請選擇日期</option>
                                        {
                                        this.state.days_rang.map((item, i) => <option key={i} value={item.val}>{item.Lname}</option>)
                                        }
                                        </select>
                                    </div>
                                <div className="col-md-3 col-xs-12  gutter-sm-down">
                                    <select name="" id="" className="form-control c-select"
                                        value={fieldData.view_time} onChange={this.changeInputVal.bind(this, 'view_time') } required>
                                        {
                                        DT.TestDriveTime.map((item, i) => <option key={i} value={item.id}>{item.label}</option>)
                                        }
                                        </select>
                                    </div>
                                </div>
                                </div>
                            </div>

                        <div className="col-lg-6 col-xs-12">
                            <div className="form-group">
                            {view_location_html}

                            <div className="row">
                                <div className="col-sm-6 col-xs-12">
                                    <select name="" id="" className="form-control c-select"
                                        value={fieldData.view_city} onChange={this.onCityChange.bind(this, 'view_city') } required>
                                        <option value="" defaultValue="" disabled>選擇縣市</option>
                                        {
                                        DT.twDistrict.map((item, i) => <option key={i} value={item.city}>{item.city}</option>)
                                        }
                                        </select>
                                    </div>
                                <div className="col-sm-6 col-xs-12 gutter-xs-down">
                                    <select name="" id="view_location" className="form-control c-select"
                                        value={fieldData.view_location} onChange={this.changeInputVal.bind(this, 'view_location') } required>
                                        <option value="" defaultValue="" disabled>選擇營業所</option>
                                        {
                                        view_location.map((item, i) => <option key={i} value={item.location_id}>{item.location_name}</option>)
                                        }
                                        </select>
                                    </div>
                                </div>
                                </div>
                            </div>

                        <div className="col-xs-12">
                            <div id="map"></div>
                            </div>

                         <div className="col-xs-12">
                            <div className="form-group c-inputs-stacked">

                                  {/*is_argee_html*/}

                                  <label className="c-input c-checkbox">
                                    <input id="checkbox2" name="checkbox" type="checkbox"
                                        value={fieldData.is_edm} onChange={this.changeCheckBoxVal.bind(this, 'is_edm') }/>
                                    <span className="c-indicator"><i className="ti-check"></i></span>
                                    我願意收到EDM
                                      </label>

                                </div>
                                <div className="form-group">
                                <label className="sr-only">驗證</label>
                                <div id="Validate"></div>
                                    </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-lg">填寫完成，送出資料</button>
                                </div>
                             </div>

                             </div>
                        </form>
                    </div>
            );
            return outHtml;
        }
    }
}

var dom = document.getElementById('email_content');
ReactDOM.render(<TestDriveEmail.GridForm />, dom);