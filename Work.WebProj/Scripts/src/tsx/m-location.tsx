import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import DT = require('dt');

namespace Location {
    interface Rows {
        location_id?: string;
        check_del?: boolean,
        location_name?: string;
        area?: string;
        city?: string;
        country?: string;
        address?: string;
        is_sales?: boolean;
        is_repair?: boolean;
        sort?: number;
        i_Hide?: boolean;
    }
    interface FormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        searchData?: {
            keyword: string,
            area: string,
            type: number
        }
        country_list?: any[],
        is_admin?: boolean
    }
    interface FormResult extends IResultBase {
        id: string
    }

    class GridRow extends React.Component<BaseDefine.GridRowPropsBase<Rows>, BaseDefine.GridRowStateBase> {
        constructor() {
            super();
            this.delCheck = this.delCheck.bind(this);
            this.modify = this.modify.bind(this);
        }
        static defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPathName: gb_approot + 'api/Location'
        }
        delCheck(i, chd) {
            this.props.delCheck(i, chd);
        }
        modify() {
            this.props.updateType(this.props.primKey)
        }
        render() {
            let StateForGird = CommCmpt.StateForGird;
            return <tr>
                       <td className="text-center"><CommCmpt.GridCheckDel iKey={this.props.ikey} chd={this.props.itemData.check_del} delCheck={this.delCheck} /></td>
                       <td className="text-center"><CommCmpt.GridButtonModify modify={this.modify} /></td>
                       <td><StateForGird id={this.props.itemData.area} stateData={DT.LocationArea} /></td>
                       <td>{this.props.itemData.location_name}</td>
                       <td>{this.props.itemData.address}</td>
                       <td>{this.props.itemData.sort }</td>
                       <td>{this.props.itemData.is_sales ? <span className="label label-info">是</span> : <span className="label label-default">否</span>}</td>
                       <td>{this.props.itemData.is_repair ? <span className="label label-success">是</span> : <span className="label label-default">否</span>}</td>
                       <td>{this.props.itemData.i_Hide ? <span className="label label-default">隱藏</span> : <span className="label label-primary">顯示</span>}</td>
                </tr>;

        }
    }
    export class GridForm extends React.Component<BaseDefine.GridFormPropsBase, FormState<Rows, server.Location>>{

        constructor() {

            super();
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.insertType = this.insertType.bind(this);
            this.changeGDValue = this.changeGDValue.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.onCityChange = this.onCityChange.bind(this);
            this.listCountry = this.listCountry.bind(this);
            this.setFDValue = this.setFDValue.bind(this);
            this.render = this.render.bind(this);


            this.state = {
                fieldData: {},
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null, area: null, type: null },
                country_list: [],
                is_admin: false
            }
        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Location'
        }
        componentDidMount() {
            this.queryGridData(1);
            if (gb_roles == "Admins") { this.setState({ is_admin: true }); }
        }
        gridData(page: number) {

            var parms = {
                page: 0
            };

            if (page == 0) {
                parms.page = this.state.gridData.page;
            } else {
                parms.page = page;
            }

            $.extend(parms, this.state.searchData);
            return CommFunc.jqGet(this.props.apiPath, parms);
        }
        queryGridData(page: number) {
            this.gridData(page)
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ gridData: data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        handleSubmit(e: React.FormEvent) {

            e.preventDefault();
            if (this.state.edit_type == 1) {
                CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                    .done((data: FormResult, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '新增完成', 1);
                            this.updateType(data.id);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            }
            else if (this.state.edit_type == 2) {
                CommFunc.jqPut(this.props.apiPath, this.state.fieldData)
                    .done((data, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '修改完成', 1);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            };
            return;
        }
        handleOnBlur(date) {

        }
        deleteSubmit() {

            if (!confirm('確定是否刪除?')) {
                return;
            }

            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].location_id);
                }
            }

            if (ids.length == 0) {
                CommFunc.tosMessage(null, '未選擇刪除項', 2);
                return;
            }

            CommFunc.jqDelete(this.props.apiPath + '?' + ids.join('&'), {})
                .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        CommFunc.tosMessage(null, '刪除完成', 1);
                        this.queryGridData(0);
                    } else {
                        alert(data.message);
                    }
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        handleSearch(e: React.FormEvent) {
            e.preventDefault();
            this.queryGridData(0);
            return;
        }
        delCheck(i: number, chd: boolean) {
            let newState = this.state;
            this.state.gridData.rows[i].check_del = !chd;
            this.setState(newState);
        }
        checkAll() {

            let newState = this.state;
            newState.checkAll = !newState.checkAll;
            for (var prop in this.state.gridData.rows) {
                this.state.gridData.rows[prop].check_del = newState.checkAll;
            }
            this.setState(newState);
        }
        insertType() {
            this.setState({
                edit_type: 1, fieldData: {
                    i_Hide: false,
                    sort: 0,
                    city: "",
                    area: "",
                    zip: "",
                    is_sales: false,
                    is_repair: false,
                    business_hours: ""
                }
            });
        }
        updateType(id: number | string) {

            CommFunc.jqGet(this.props.apiPath, { id: id })
                .done((data, textStatus, jqXHRdata) => {
                    this.listCountry(data.data.city);
                    this.setState({ edit_type: 2, fieldData: data.data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        noneType() {
            this.gridData(0)
                .done(function (data, textStatus, jqXHRdata) {
                    this.setState({ edit_type: 0, gridData: data });
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    CommFunc.showAjaxError(errorThrown);
                });
        }

        changeFDValue(name: string, e: React.SyntheticEvent) {
            this.setInputValue(this.props.fdName, name, e);
        }
        changeGDValue(name: string, e: React.SyntheticEvent) {
            this.setInputValue(this.props.gdName, name, e);
        }
        setInputValue(collentName: string, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state[collentName];
            if (input.value == 'true') {
                obj[name] = true;
            } else if (input.value == 'false') {
                obj[name] = false;
            } else {
                obj[name] = input.value;
            }
            this.setState({ fieldData: obj });
            if (collentName == this.props.gdName) {
                this.queryGridData(0);
            }
        }
        onCityChange(collentName: string, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state[collentName];
            this.listCountry(input.value);
            obj['city'] = input.value;
            this.setState({ fieldData: obj });
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
        setFDValue(fieldName, value) {
            //此function提供給次元件調用，所以要以屬性往下傳。
            var obj = this.state[this.props.fdName];
            obj[fieldName] = value;
            this.setState({ fieldData: obj });
        }
        render() {

            var outHtml: JSX.Element = null;

            if (this.state.edit_type == 0) {
                let searchData = this.state.searchData;
                let GridNavPage = CommCmpt.GridNavPage;

                outHtml =
                    (
                        <div>
                    <h3 className="title">
                        {this.props.caption}
                        </h3>
                    <form onSubmit={this.handleSearch}>
                        <div className="table-responsive">
                            <div className="table-header">
                                <div className="table-filter">
                                    <div className="form-inline">
                                        <div className="form-group">
                                            <label>據點名稱/地址</label> { }
                                            <input type="text" className="form-control"
                                                onChange={this.changeGDValue.bind(this, 'keyword') }
                                                value={searchData.keyword}
                                                placeholder="請輸入關鍵字..." /> { }
                                            <label>據點</label> { }
                                            <select className="form-control"
                                                onChange={this.changeGDValue.bind(this, 'type') }
                                                value={searchData.type}>
                                                    <option value="">全部</option>
                                                    <option value="1">展示中心</option>
                                                    <option value="2">維修據點</option>
                                                </select> { }
                                            <label>區域</label> { }
                                            <select className="form-control"
                                                onChange={this.changeGDValue.bind(this, 'area') }
                                                value={searchData.area}>
                                                    <option value="">全部</option>
                                                    {
                                                    DT.LocationArea.map((item, i) => <option key={i} value={item.id}>{item.label}</option>)
                                                    }
                                                </select> { }
                                            <button className="btn-primary" type="submit"><i className="fa-search"></i> 搜尋</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th className="col-xs-1 text-center">
                                            <label className="cbox">
                                                <input type="checkbox" checked={this.state.checkAll} onChange={this.checkAll} />
                                                <i className="fa-check"></i>
                                                </label>
                                            </th>
                                        <th className="col-xs-1 text-center">修改</th>
                                        <th className="col-xs-1">區域</th>
                                        <th className="col-xs-1">據點名稱</th>
                                        <th className="col-xs-3">地址</th>
                                        <th className="col-xs-1">排序</th>
                                        <th className="col-xs-1">展示中心</th>
                                        <th className="col-xs-1">維修據點</th>
                                        <th className="col-xs-1">狀態</th>
                                        </tr>
                                    </thead>
                                <tbody>
                                    {
                                    this.state.gridData.rows.map(
                                        (itemData, i) =>
                                            <GridRow key={i}
                                                ikey={i}
                                                primKey={itemData.location_id}
                                                itemData={itemData}
                                                delCheck={this.delCheck}
                                                updateType={this.updateType} />
                                    )
                                    }
                                    </tbody>
                                </table>
                            </div>
                    <GridNavPage
                        startCount={this.state.gridData.startcount}
                        endCount={this.state.gridData.endcount}
                        recordCount={this.state.gridData.records}
                        totalPage={this.state.gridData.total}
                        nowPage={this.state.gridData.page}
                        onQueryGridData={this.queryGridData}
                        InsertType={this.insertType}
                        deleteSubmit={this.deleteSubmit}
                        showAdd={this.state.is_admin}
                        />
                        </form>
                            </div>
                    );
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let fieldData = this.state.fieldData;
                let InputDate = CommCmpt.InputDate;
                let country_list = this.state.country_list;
                let coordinate_html: JSX.Element = null;//座標
                if (this.state.is_admin) {
                    coordinate_html = (
                        <div className="form-group">
                <label className="col-xs-2 control-label">北_座標(North) </label>
                <div className="col-xs-3">
                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'north_coordinate') } value={fieldData.north_coordinate}  required/>
                    </div>
                <label className="col-xs-2 control-label">東_座標(East) </label>
                <div className="col-xs-3">
                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'east_coordinate') } value={fieldData.east_coordinate} required />
                    </div>
                <small className="col-xs-2 help-inline"><span className="text-danger">(座標皆必填) </span></small>
                            </div>);
                }


                outHtml = (
                    <div>
    <h4 className="title"> {this.props.caption} 基本資料維護</h4>
    <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="col-xs-10">
            <div className="form-group">
                <label className="col-xs-2 control-label">區域</label>
                <div className="col-xs-8">
                    <select className="form-control" onChange={this.changeFDValue.bind(this, 'area') } value={fieldData.area} required>
                        <option value="" defaultValue="" disabled>請選擇區域</option>
                        {
                        DT.LocationArea.map((itemData, i) => <option key={i} value={itemData.id}>{itemData.label}</option>)
                        }
                        </select>
                    </div>
                <small className="col-xs-2 help-inline"><span className="text-danger">(必填) </span></small>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">地址</label>
                <CommCmpt.TwAddress ver={1}
                    onChange={this.changeFDValue}
                    setFDValue={this.setFDValue}
                    zip_value={fieldData.zip}
                    city_value={fieldData.city}
                    country_value={fieldData.country}
                    address_value={fieldData.address}
                    required={true}
                    zip_field="zip"
                    city_field="city"
                    country_field="country"
                    address_field="address"
                    />
                <small className="col-xs-1 help-inline"><span className="text-danger">(必填) </span></small>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">據點名稱</label>
                <div className="col-xs-8">
                    <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'location_name') } value={fieldData.location_name} maxLength={64}  required/>
                    </div>
                <small className="col-xs-2 help-inline"><span className="text-danger">(必填) </span>, 最多64字</small>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">電話</label>
                <div className="col-xs-3">
                    <input type="tel" className="form-control" onChange={this.changeFDValue.bind(this, 'tel') } value={fieldData.tel}  required/>
                    </div>
                <small className="col-xs-1 help-inline"><span className="text-danger">(必填) </span></small>
                <label className="col-xs-1 control-label">傳真</label>
                <div className="col-xs-3">
                    <input type="tel" className="form-control" onChange={this.changeFDValue.bind(this, 'fax') } value={fieldData.fax}/>
                    </div>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">為展示中心</label>
                <div className="col-xs-4">
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="is_sales"
                                value={true}
                                checked={fieldData.is_sales === true}
                                onChange={this.changeFDValue.bind(this, 'is_sales') }
                                />
                            <span>是</span>
                           </label>
                       </div>
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="is_sales"
                                value={false}
                                checked={fieldData.is_sales === false}
                                onChange={this.changeFDValue.bind(this, 'is_sales') }
                                />
                            <span>否</span>
                           </label>
                       </div>
                    </div>
                <label className="col-xs-2 control-label">為維修據點</label>
                <div className="col-xs-3">
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="is_repair"
                                value={true}
                                checked={fieldData.is_repair === true}
                                onChange={this.changeFDValue.bind(this, 'is_repair') }
                                />
                            <span>是</span>
                           </label>
                       </div>
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="is_repair"
                                value={false}
                                checked={fieldData.is_repair === false}
                                onChange={this.changeFDValue.bind(this, 'is_repair') }
                                />
                            <span>否</span>
                           </label>
                       </div>
                    </div>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">狀態</label>
                <div className="col-xs-4">
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="i_Hide"
                                value={true}
                                checked={fieldData.i_Hide === true}
                                onChange={this.changeFDValue.bind(this, 'i_Hide') }
                                />
                            <span>隱藏</span>
                           </label>
                       </div>
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="i_Hide"
                                value={false}
                                checked={fieldData.i_Hide === false}
                                onChange={this.changeFDValue.bind(this, 'i_Hide') }
                                />
                            <span>顯示</span>
                           </label>
                       </div>
                    </div>
                <label className="col-xs-2 control-label">排序</label>
                <div className="col-xs-2">
                    <input type="number" className="form-control" onChange={this.changeFDValue.bind(this, 'sort') } value={fieldData.sort}  />
                    </div>
                <small className="col-xs-2 help-inline">數字越大越前面</small>
                </div>
            {coordinate_html}
            <div className="form-group">
                <label className="col-xs-2 control-label">營業時間</label>
                <div className="col-xs-8">
                    <textarea type="text" className="form-control" rows={3} value={fieldData.business_hours} onChange={this.changeFDValue.bind(this, 'business_hours') } maxLength={256} />
                    </div>
                <small className="col-xs-2 help-inline">最多256字</small>
                </div>
            <div className="form-action">
                <div className="col-xs-4 col-xs-offset-2">
                    <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }
                    <button type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
                    </div>
                </div>
            </div>
        </form>
                        </div>
                );
            }

            return outHtml;
        }
    }
}

var dom = document.getElementById('page_content');
ReactDOM.render(<Location.GridForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);