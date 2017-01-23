import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import DT = require('dt');

namespace LoanEmail {
    interface LoanData {
        //basic
        name?: string,
        sex?: boolean,
        email?: string,
        tel?: string,
        response?: string
        
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
    interface EmailResult {
        result: boolean;
        message: string;
    }
    interface Formprops {
        apiPath?: string;
    }
    export class GridForm extends React.Component<Formprops, {
        fieldData: LoanData
    }>{

        constructor() {

            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.changeInputVal = this.changeInputVal.bind(this);
            this.render = this.render.bind(this);


            this.state = {
                fieldData: {
                    loan_project: ""
                }
            }
        }
        static defaultProps: Formprops = {
            apiPath: gb_approot + 'Loan/sendMail'
        }
        componentDidMount() {

        }
        handleSubmit(e: React.FormEvent) {
            e.preventDefault();
            this.state.fieldData.response = grecaptcha.getResponse(widgetId);

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
            this.setState({ fieldData: obj });
        }
        render() {

            var outHtml: JSX.Element = null;
            let project_html: JSX.Element = null;
            let fieldData = this.state.fieldData;

            if (fieldData.loan_project == "新車購車分期") {
                project_html = (<div>
                    <div className="col-xs-12 col-sm-6">
                        <div className="form-group">
                            <label  className="control-label">購買車型 <small className="text-danger">*</small></label>
                            <input type="text" className="form-control c-input" value={fieldData.car_models} onChange={this.changeInputVal.bind(this, 'car_models') } required />
                            </div>
                        </div>
                    <div className="col-xs-12 col-sm-6">
                        <div className="form-group">
                            <label className="control-label">車輛牌價</label>
                            <div className="input-group">
                                <span className="input-group-addon">$</span>
                                <input type="number" className="form-control c-input" value={fieldData.car_price} onChange={this.changeInputVal.bind(this, 'car_price') } />
                                <span className="input-group-addon">(未扣除貨物稅) </span>
                                </div>
                            </div>
                        </div>
                    <div className="col-xs-6 col-sm-3">
                        <div className="form-group">
                            <label className="control-label">頭款 <small className="text-danger">*</small></label>
                            <div className="input-group">
                                <span className="input-group-addon">$</span>
                                <input type="number" className="form-control c-input" value={fieldData.down_payment} onChange={this.changeInputVal.bind(this, 'down_payment') } required />
                                </div>
                            </div>
                        </div>
                    <div className="col-xs-6 col-sm-3">
                        <div className="form-group">
                            <label className="control-label">貸款金額</label>
                            <div className="input-group">
                                <span className="input-group-addon">$</span>
                                <input type="number" className="form-control c-input" value={fieldData.loan_price} onChange={this.changeInputVal.bind(this, 'loan_price') }  />
                                </div>
                            </div>
                        </div>

                    <div className="col-xs-6 col-sm-2">
                        <div className="form-group">
                            <label  className="control-label">期繳 <small className="text-danger">*</small></label>
                            <div className="input-group">
                                <span className="input-group-addon">$</span>
                                <input type="number" className="form-control c-input" value={fieldData.installments} onChange={this.changeInputVal.bind(this, 'installments') } required />
                                </div>
                            </div>
                        </div>

                    <div className="col-xs-6 col-sm-2">
                        <div className="form-group">
                            <label className="control-label">利率 <small className="text-danger">*</small></label>
                            <div className="input-group">
                                <input type="number" className="form-control c-input" value={fieldData.rate} onChange={this.changeInputVal.bind(this, 'rate') } required />
                                <span className="input-group-addon">%</span>
                                </div>
                            </div>
                        </div>

                    <div className="col-xs-12 col-sm-2">
                        <div className="form-group">
                            <label  className="control-label">月付款</label>
                            <div className="input-group">
                                <span className="input-group-addon">$</span>
                                <input type="number" className="form-control c-input" value={fieldData.monthly_payment} onChange={this.changeInputVal.bind(this, 'monthly_payment') } />
                                </div>
                            </div>
                        </div>
                    </div>);
            } else if (fieldData.loan_project == "中古車貸款申請") {
                project_html = (<div>
                    <div className="col-xs-6 col-sm-3">
                        <div className="form-group">
                            <label className="control-label">車牌號碼 <small className="text-danger">*</small></label>
                            <input type="text" className="form-control c-input" value={fieldData.license_plate_number} onChange={this.changeInputVal.bind(this, 'license_plate_number') } required/>
                            </div>
                        </div>

                    <div className="col-xs-6 col-sm-3">
                        <div className="form-group">
                            <label className="control-label">車輛廠牌 <small className="text-danger">*</small></label>
                            <input type="text" className="form-control c-input" value={fieldData.car_brand} onChange={this.changeInputVal.bind(this, 'car_brand') } required/>
                            </div>
                        </div>

                    <div className="col-xs-12 col-sm-3">
                        <div className="form-group">
                            <label className="control-label">車型 <small className="text-danger">*</small></label>
                            <input type="text" className="form-control c-input" value={fieldData.car_models} onChange={this.changeInputVal.bind(this, 'car_models') } required/>
                            </div>
                        </div>

                    <div className="col-xs-12 col-sm-3">
                        <div className="form-group">
                            <label  className="control-label">出廠年份</label>
                            <div className="row">
                                <div className="col-xs-6">
                                    <div className="input-group">
                                        <input type="number" className="form-control c-input"
                                            min={1}
                                            value={fieldData.car_year} onChange={this.changeInputVal.bind(this, 'car_year') } />
                                        <span className="input-group-addon">年</span>
                                        </div>
                                    </div>
                                <div className="col-xs-6">
                                    <div className="input-group">
                                        <input type="number" className="form-control c-input"
                                            min={1} max={12}
                                            value={fieldData.car_month} onChange={this.changeInputVal.bind(this, 'car_month') } />
                                        <span className="input-group-addon">月</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>);
            }

            outHtml = (
                <div>
                    <h5 className="h5">請填妥以下基本資料，我們將於工作天1~2天內(不含假日) 儘速回覆。</h5>
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

                        <div className="col-xs-12">
                            <div className="form-group">
                                <label  className="control-label">請選擇申貸項目 <small className="text-danger">*</small></label>
                                <select className="form-control c-select" value={fieldData.loan_project} onChange={this.changeInputVal.bind(this, 'loan_project') }
                                    required>
                                    <option value="" defaultValue="" disabled>請選擇</option>
                                    <option value="新車購車分期">新車購車分期</option>
                                    <option value="中古車貸款申請">中古車貸款申請</option>
                                    </select>
                                </div>
                            </div>

                        {project_html}

                        <div className="col-xs-12">
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
ReactDOM.render(<LoanEmail.GridForm />, dom);