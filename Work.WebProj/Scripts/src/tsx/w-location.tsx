import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import DT = require('dt');

namespace W_Location {
    interface FormState {
        sales?: server.Location[];
        repair?: server.Location[];
        searchData?: {
            city: string;
            country: string;
        }
        country_list?: any[],
        class_string?: { sales: string; repair: string; }
        type?: number;
    }
    interface EmailResult {
        result: boolean;
        message: string;
    }
    interface Formprops {
        apiPath?: string;
        apiInitPath?: string;
        styles?: any;
    }
    export class GridForm extends React.Component<Formprops, FormState>{

        constructor() {

            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.changeInputVal = this.changeInputVal.bind(this);
            this.queryInitData = this.queryInitData.bind(this);
            this.onCityChange = this.onCityChange.bind(this);
            this.listCountry = this.listCountry.bind(this);
            this.onChangeType = this.onChangeType.bind(this);
            this.setMapData = this.setMapData.bind(this);
            this.render = this.render.bind(this);


            this.state = {
                sales: [],
                repair: [],
                searchData: { city: "", country: "" },
                country_list: [],
                class_string: { sales: "btn btn-primary btn-lg", repair: "btn btn-primary btn-lg" },
                type: null
            }
        }
        static defaultProps: Formprops = {
            apiPath: gb_approot + 'Loan/sendMail',
            apiInitPath: gb_approot + 'BuyCar/GetLocation',
            styles: {
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
            }
        }
        componentDidMount() {
            this.queryInitData();
            this.state.type = gb_type;
            if (this.state.type == LocationType.sales) {
                this.setState({ class_string: { sales: "btn btn-primary btn-lg active", repair: "btn btn-primary btn-lg" }, type: gb_type });
            } else if (this.state.type == LocationType.repair) {
                this.setState({ class_string: { sales: "btn btn-primary btn-lg", repair: "btn btn-primary btn-lg active" }, type: gb_type });
            } else {
                this.setState({ class_string: { sales: "btn btn-primary btn-lg", repair: "btn btn-primary btn-lg" }, type: null });
            }
        }
        queryInitData() {
            CommFunc.jqGet(this.props.apiInitPath, this.state.searchData)
                .done((data, textStatus, jqXHRdata) => {
                    this.setMapData(this.state.type, data.sales, data.repair);
                    this.setState({ sales: data.sales, repair: data.repair });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        changeInputVal(name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.searchData
            if (input.value == 'true') {
                obj[name] = true;
            } else if (input.value == 'false') {
                obj[name] = false;
            } else {
                obj[name] = input.value;
            }
            this.setState({ searchData: obj });
            this.queryInitData();
        }
        onCityChange(name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.searchData;
            this.listCountry(input.value);
            obj['city'] = input.value;
            obj['country'] = "";
            this.setState({ searchData: obj });
            this.queryInitData();
        }
        listCountry(value) {
            for (var i in DT.twDistrict) {
                var item = DT.twDistrict[i];
                if (item.city == value) {
                    this.setState({ country_list: item.contain });
                    break;
                }
            }
        }
        onChangeType(type) {
            if (type == LocationType.sales) {
                this.setState({ class_string: { sales: "btn btn-primary btn-lg active", repair: "btn btn-primary btn-lg" }, type: type });
            } else if (type == LocationType.repair) {
                this.setState({ class_string: { sales: "btn btn-primary btn-lg", repair: "btn btn-primary btn-lg active" }, type: type });
            } else {
                this.setState({ class_string: { sales: "btn btn-primary btn-lg", repair: "btn btn-primary btn-lg" }, type: null });
            }
            this.setMapData(type, this.state.sales, this.state.repair);
        }
        setMapData(type: number, sales: server.Location[], repair: server.Location[]) {
            let data: server.MapData[] = [];
            if (type == LocationType.sales) {
                sales.forEach((item, i) => data.push({ title: item.location_name, north: item.north_coordinate, east: item.east_coordinate, memo: item.city + item.country + item.address, index: item.location_id }));
            } else if (type == LocationType.repair) {
                repair.forEach((item, i) => data.push({ title: item.location_name, north: item.north_coordinate, east: item.east_coordinate, memo: item.city + item.country + item.address, index: item.location_id }));
            }
            gb_map_data = data;
            setNewMapMarker(type);
        }
        render() {

            var outHtml: JSX.Element = null;
            let sales = this.state.sales;
            let repair = this.state.repair;
            let searchData = this.state.searchData;
            let country_list = this.state.country_list;

            let class_string = this.state.class_string;
            let styles = this.props.styles;
            let table_html: JSX.Element = null;

            if (this.state.type == LocationType.sales) {
                table_html = (
                    <section className="location">
                <h2 className="sr-only">據點列表</h2>
                {/*----展示中心start----*/}
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
                           {
                           sales.map((item, i) => <tr key={i}>
                                            <td>{item.city}</td>
                                            <td>{item.country}</td>
                                            <td>{item.city + item.country + item.address}</td>
                                            <td>{item.tel}</td>
                                            <td>{item.business_hours}</td>
                               </tr>)
                           }
                            </tbody>
                        </table>
                    </div>
                {/*----展示中心end----*/}
                        </section>
                );
            } else if (this.state.type == LocationType.repair) {
                table_html = (
                    <section className="location">
                <h2 className="sr-only">據點列表</h2>
                {/*----維修據點start----*/}
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
                           {
                           repair.map((item, i) => <tr key={i}>
                                            <td>{item.city}</td>
                                            <td>{item.country}</td>
                                            <td>{item.city + item.country + item.address}</td>
                                            <td>{item.tel}</td>
                                            <td>{item.business_hours}</td>
                               </tr>)
                           }
                            </tbody>
                        </table>
                    </div>
                {/*----維修據點end----*/}
                        </section>
                );
            } else {
                table_html = (
                    <section className="location">
                <h2 className="sr-only">據點列表</h2>
                {/*----展示中心start----*/}
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
                           {
                           sales.map((item, i) => <tr key={i}>
                                            <td>{item.city}</td>
                                            <td>{item.country}</td>
                                            <td>{item.city + item.country + item.address}</td>
                                            <td>{item.tel}</td>
                                            <td>{item.business_hours}</td>
                               </tr>)
                           }
                            </tbody>
                        </table>
                    </div>
                {/*----展示中心end----*/}
                {/*----維修據點start----*/}
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
                           {
                           repair.map((item, i) => <tr key={i}>
                                            <td>{item.city}</td>
                                            <td>{item.country}</td>
                                            <td>{item.city + item.country + item.address}</td>
                                            <td>{item.tel}</td>
                                            <td>{item.business_hours}</td>
                               </tr>)
                           }
                            </tbody>
                        </table>
                    </div>
                {/*----維修據點end----*/}
                        </section>
                );
            }


            outHtml = (
                <div>
                <div className="wrap">

            <section className="search">
                <h2 className="h1">營業據點查詢</h2>

                <form className="form" action="">
                    <div className="form-group text-xs-center">

                        <button type="button" onClick={this.onChangeType.bind(this, LocationType.sales) } className={class_string.sales}>展示中心查詢</button>
                        <button type="button" onClick={this.onChangeType.bind(this, LocationType.repair) } className={class_string.repair}>維修據點查詢</button>

                        </div>
                    <div className="form-group">
                        <label className="sr-only">選擇縣市</label>
                        <select name="" id="" className="form-control c-select" value={searchData.city} onChange={this.onCityChange.bind(this, 'city') }>
                            <option value="" defaultValue="">選擇縣市</option>
                            {
                            DT.twDistrict.map((item, i) => <option key={i} value={item.city}>{item.city}</option>)
                            }
                            </select>
                        </div>
                    <div className="form-group">
                        <label className="sr-only">選擇區域</label>
                        <select name="" id="" className="form-control c-select" value={searchData.country} onChange={this.changeInputVal.bind(this, 'country') }>
                            <option value="" defaultValue="">選擇區域</option>
                            {
                            country_list.map((item, i) => <option key={i} value={item.county}>{item.county}</option>)
                            }
                            </select>
                        </div>
                    </form>
                </section>

            <section className="map">
                <h2 className="sr-only">地圖</h2>
                <div id="map"></div>
                </section>
                {table_html}
                    </div>
                    </div>
            );
            return outHtml;
        }
    }
}

var dom = document.getElementById('location');
ReactDOM.render(<W_Location.GridForm />, dom);