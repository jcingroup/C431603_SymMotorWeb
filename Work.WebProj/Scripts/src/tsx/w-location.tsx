import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import DT = require('dt');

namespace W_Location {
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

            CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                .done((data: EmailResult, textStatus, jqXHRdata) => {
                    console.log(data);
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
            var styles = {
                width_10: {
                    width: '10%'
                },
                width_20: {
                    width: '20%'
                },
                width_25: {
                    width: '25%'
                },
                width_35: {
                    width: '35%'
                }
            };

            outHtml = (
                <div>
                <div className="wrap">

            <section className="search">
                <h2 className="h1">營業據點查詢</h2>

                <form className="form" action="">
                    <div className="form-group text-xs-center">

                        @* 被按到的按鈕要加 class ="active" * @
                        <button className="btn btn-primary btn-lg">展示中心查詢</button>
                        <button className="btn btn-primary btn-lg">維修據點查詢</button>

                        </div>
                    <div className="form-group">
                        <label className="sr-only">選擇縣市</label>
                        <select name="" id="" className="form-control c-select">
                            <option value="" defaultValue="" disabled>選擇縣市</option>
                            </select>
                        </div>
                    <div className="form-group">
                        <label className="sr-only">選擇區域</label>
                        <select name="" id="" className="form-control c-select">
                            <option value="" defaultValue="" disabled>選擇區域</option>
                            </select>
                        </div>
                    </form>
                </section>

            <section className="map">
                <h2 className="sr-only">地圖</h2>

                <div id="map"></div>

                </section>

            <section className="location">
                <h2 className="sr-only">據點列表</h2>

                @* 展示中心 * @
                <h3 className="h3">展示中心</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={styles.width_10}>縣市</th>
                                <th style={styles.width_10}>區域</th>
                                <th style={styles.width_25}>地址</th>
                                <th style={styles.width_20}>電話</th>
                                <th style={styles.width_35}>營業時間</th>
                                </tr>
                            </thead>
                        <tbody>
                            <tr>
                                <td>台北市</td>
                                <td>內湖區</td>
                                <td>台北市內湖區民權東路六段13-15號</td>
                                <td>(02) 2795-4532</td>
                                <td></td>
                                </tr>
                            <tr>
                                <td>台北市</td>
                                <td>內湖區</td>
                                <td>台北市內湖區民權東路六段13-15號</td>
                                <td>(02) 2795-4532</td>
                                <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                @* end of 展示中心 * @

                @* 維修據點 * @
                <h3 className="h3">維修據點</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={styles.width_10}>縣市</th>
                                <th style={styles.width_10}>區域</th>
                                <th style={styles.width_25}>地址</th>
                                <th style={styles.width_20}>電話</th>
                                <th style={styles.width_35}>營業時間</th>
                                </tr>
                            </thead>
                        <tbody>
                            <tr>
                                <td>台北市</td>
                                <td>內湖區</td>
                                <td>台北市內湖區民權東路六段13-15號</td>
                                <td>(02) 2795-4532</td>
                                <td></td>
                                </tr>
                            <tr>
                                <td>台北市</td>
                                <td>內湖區</td>
                                <td>台北市內湖區民權東路六段13-15號</td>
                                <td>(02) 2795-4532</td>
                                <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                @* end of 維修據點 * @

                </section>

                    </div>
                    </div>
            );
            return outHtml;
        }
    }
}

var dom = document.getElementById('location');
ReactDOM.render(<W_Location.GridForm />, dom);