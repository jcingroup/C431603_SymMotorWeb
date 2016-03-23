import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import DT = require('dt');

namespace TestDrive {
    interface Rows {
        test_drive_id?: string;
        check_del?: boolean,
        name?: string;
        sex?: boolean;
        email?: string;
        view_year?: number;
        view_month?: number;
        view_day?: number;
        view_time?: string;
        car_models_name?: string;
        tel?: string;
    }
    interface FormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        searchData?: {
            keyword: string,
            city: string
        }
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
            apiPathName: gb_approot + 'api/TestDrive'
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
                       <td className="text-center"><CommCmpt.GridButtonModify modify={this.modify} ver={2}/></td>
                       <td>{this.props.itemData.name}</td>
                       <td>{this.props.itemData.sex ? <span className="label label-primary">男</span> : <span className="label label-danger">女</span>}</td>
                       <td>{this.props.itemData.email }</td>
                       <td>{this.props.itemData.tel }</td>
                       <td>{this.props.itemData.car_models_name }</td>
                       <td>{this.props.itemData.view_year + '/' + this.props.itemData.view_month + '/' + this.props.itemData.view_day + ' ' + this.props.itemData.view_time}</td>
                </tr>;

        }
    }
    export class GridForm extends React.Component<BaseDefine.GridFormPropsBase, FormState<Rows, server.TestDrive>>{

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
            this.render = this.render.bind(this);


            this.state = {
                fieldData: {},
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null, city: null }
            }
        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/TestDrive'
        }
        componentDidMount() {
            this.queryGridData(1);
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
                    ids.push('ids=' + this.state.gridData.rows[i].test_drive_id);
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
                edit_type: 1, fieldData: {}
            });
        }
        updateType(id: number | string) {

            CommFunc.jqGet(this.props.apiPath, { id: id })
                .done((data, textStatus, jqXHRdata) => {
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
                                            <label>姓名/email/電話</label> { }
                                            <input type="text" className="form-control"
                                                onChange={this.changeGDValue.bind(this, 'keyword') }
                                                value={searchData.keyword}
                                                placeholder="請輸入關鍵字..." /> { }
                                            <label>縣市</label> { }
                                            <select className="form-control"
                                                onChange={this.changeGDValue.bind(this, 'city') }
                                                value={searchData.city}>
                                                    <option value="">全部</option>
                                                    {
                                                    DT.twDistrict.map((item, i) => <option key={i} value={item.city}>{item.city}</option>)
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
                                        <th className="col-xs-1 text-center">檢視</th>
                                        <th className="col-xs-1">姓名</th>
                                        <th className="col-xs-1">性別</th>
                                        <th className="col-xs-1">email</th>
                                        <th className="col-xs-1">電話</th>
                                        <th className="col-xs-1">預約車款</th>
                                        <th className="col-xs-2">預約時間</th>
                                        </tr>
                                    </thead>
                                <tbody>
                                    {
                                    this.state.gridData.rows.map(
                                        (itemData, i) =>
                                            <GridRow key={i}
                                                ikey={i}
                                                primKey={itemData.test_drive_id}
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
                        showAdd={false}
                        />
                        </form>
                            </div>
                    );
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let fieldData = this.state.fieldData;
                let InputDate = CommCmpt.InputDate;

                outHtml = (
                    <div>
    <h4 className="title"> {this.props.caption} 資料檢視</h4>
    <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="col-xs-10">
            <div className="form-group">
                <label className="col-xs-2 control-label">姓名</label>
                <div className="col-xs-4">{fieldData.name}</div>
            </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">性別</label>
                <div className="col-xs-4">{fieldData.sex ? <span className="label label-primary">男</span> : <span className="label label-danger">女</span>}</div>
            </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">email</label>
                <div className="col-xs-4">{fieldData.email}</div>
            </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">電話</label>
                <div className="col-xs-4">{fieldData.tel}</div>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">試乘車款</label>
                <div className="col-xs-4">{fieldData.car_models_name}</div>
            </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">客服聯繫時間</label>
                <div className="col-xs-4">{fieldData.contact_time}</div>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">希望試乘日期</label>
                <div className="col-xs-6">{fieldData.view_year + '/' + fieldData.view_month + '/' + fieldData.view_day + ' ' + fieldData.view_time}</div>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">試乘據點</label>
                <div className="col-xs-6">{fieldData.location_name + '(' + fieldData.location_address + ')'}</div>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">願意收到EDM</label>
                 <div className="col-xs-4">{fieldData.is_edm ? <span className="label label-info">是</span> : <span className="label label-default">否</span>}</div>
                </div>

            <div className="form-action">
                <div className="col-xs-4 col-xs-offset-2">
                   {/*<button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }*/}
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
ReactDOM.render(<TestDrive.GridForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);