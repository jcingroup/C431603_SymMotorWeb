import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import DT = require('dt');

namespace Brand {
    interface Rows {
        brand_id?: string;
        check_del?: boolean,
        brand_name?: string;
        sort?: number;
        i_Hide?: boolean;
    }
    interface FormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        searchData?: {
            keyword: string
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
            apiPathName: gb_approot + 'api/Brand'
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
                       <td>{this.props.itemData.brand_name}</td>
                       <td>{this.props.itemData.sort }</td>
                       <td>{this.props.itemData.i_Hide ? <span className="label label-default">隱藏</span> : <span className="label label-primary">顯示</span>}</td>
                </tr>;

        }
    }
    export class GridForm extends React.Component<BaseDefine.GridFormPropsBase, FormState<Rows, server.Brand>>{

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
                searchData: { keyword: null }
            }
        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Brand'
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
                this.state.fieldData.BrandDetail = (this.refs["GridDetailForm"]).state.gridData;
                CommFunc.jqPut(this.props.apiPath, this.state.fieldData)
                    .done((data, textStatus, jqXHRdata) => {
                        if (data.result) {
                            (this.refs["GridDetailForm"]).queryGridData();
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
                    ids.push('ids=' + this.state.gridData.rows[i].brand_id);
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
            this.setState({ edit_type: 1, fieldData: { i_Hide: false, sort: 0 } });
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
                                            <label>標題</label> { }
                                            <input type="text" className="form-control"
                                                onChange={this.changeGDValue.bind(this, 'keyword') }
                                                value={searchData.keyword}
                                                placeholder="請輸入關鍵字..." /> { }
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
                                        <th className="col-xs-4">主分類名稱</th>
                                        <th className="col-xs-2">排序</th>
                                        <th className="col-xs-2">狀態</th>
                                        </tr>
                                    </thead>
                                <tbody>
                                    {
                                    this.state.gridData.rows.map(
                                        (itemData, i) =>
                                            <GridRow key={i}
                                                ikey={i}
                                                primKey={itemData.brand_id}
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
                        />
                        </form>
                            </div>
                    );
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let fieldData = this.state.fieldData;
                let InputDate = CommCmpt.InputDate;
                let detail_html: JSX.Element = null;
                if (this.state.edit_type == 2) {
                    detail_html = <GridDetailForm
                        MainId={fieldData.brand_id}
                        noneType={this.noneType}
                        ref="GridDetailForm" />;
                } else {
                    detail_html = <div className="form-action col-xs-12">
                                    <div className="col-xs-4 col-xs-offset-4">
                                        <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }
                                        <button type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
                                        </div>
                        </div>;
                }
                outHtml = (
                    <div>
    <h4 className="title"> {this.props.caption} 基本資料維護</h4>
    <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="col-xs-12">

            <div className="col-xs-10">

                <div className="form-group">
                    <label className="col-xs-2 control-label">主分類名稱</label>
                    <div className="col-xs-8">
                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'brand_name') } value={fieldData.brand_name} maxLength={64}  />
                        </div>
                    <small className="col-xs-2 help-inline"><span className="text-danger">(必填) </span>, 最多64字</small>
                    </div>
                <div className="form-group">
                    <label className="col-xs-2 control-label">排序</label>
                    <div className="col-xs-8">
                        <input type="number" className="form-control" onChange={this.changeFDValue.bind(this, 'sort') } value={fieldData.sort}  />
                        </div>
                    <small className="col-xs-2 help-inline">數字越大越前面</small>
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
                    </div>

                </div>

            {detail_html}
            </div>
        </form>
                        </div>
                );
            }

            return outHtml;
        }
    }

    interface DetailFormState {
        gridData?: server.BrandDetail[];
    }
    interface DetailFormProps {
        MainId: number,
        noneType(): void,
        ref: string,
        apiDetailPath?: string
    }
    //明細列表
    export class GridDetailForm extends React.Component<DetailFormProps, DetailFormState>{
        constructor() {

            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.gridData = this.gridData.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.setSubInputValue = this.setSubInputValue.bind(this);
            this.creatNewData = this.creatNewData.bind(this);
            this.deleteItem = this.deleteItem.bind(this);

            this.render = this.render.bind(this);
            this.state = {
                gridData: []
            }
        }
        static defaultProps = {
            apiDetailPath: gb_approot + 'api/BrandDetail'
        }
        componentDidMount() {
            this.queryGridData();
        }
        gridData(main_id?: number) {
            if (main_id != undefined) {
                var parms = {
                    main_id: main_id
                };
            } else {
                var parms = {
                    main_id: this.props.MainId
                };
            }
            return CommFunc.jqGet(this.props.apiDetailPath, parms);
        }
        queryGridData(main_id?: number) {
            this.gridData(main_id)
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ gridData: data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        setSubInputValue(i: number, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let gridData = this.state.gridData;
            let obj = gridData[i];
            if (input.value == 'true') {
                obj[name] = true;
            } else if (input.value == 'false') {
                obj[name] = false;
            } else {
                obj[name] = input.value;
            }
            this.setState({ gridData: gridData });
        }
        creatNewData() {
            let newState = this.state;
            let newData: server.BrandDetail = {
                brand_detail_id: 0,
                brand_id: this.props.MainId,
                link_url: null,
                detail_name: null,
                sort: 0,
                i_Hide: false,
                edit_state: EditState.Insert
            };
            newState.gridData.push(newData);
            this.setState(newState);
        }
        deleteItem(i: number) {
            var newState = this.state;
            var data = newState.gridData[i];

            if (data.edit_state == EditState.Insert) {
                newState.gridData.splice(i, 1);
                this.setState(newState);
            } else {
                CommFunc.jqDelete(this.props.apiDetailPath + '?ids=' + data.brand_detail_id, {})
                    .done(function (data, textStatus, jqXHRdata) {
                        if (data.result) {
                            newState.gridData.splice(i, 1);
                            this.setState(newState);
                        } else {
                            tosMessage(null, data.message, 1);
                        }
                    }.bind(this))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        showAjaxError(errorThrown);
                    });
            }
        }
        render() {

            var outHtml: JSX.Element = null;
            outHtml = (
                <div className="col-xs-12">
                    <p>
                        <button className="btn-success" type="button" onClick={this.creatNewData.bind(this) }>
                            <i className="fa-plus-circle"></i> 新增次分類
                            </button>
                        </p>
                        <div className="panel-group" ref="SortForm" id="SortForm">
                    {
                    this.state.gridData.map((itemData, i) =>
                        <GridDetailField key={i + '-' + itemData.brand_detail_id} iKey={i} fieldData={itemData}
                            setSubInputValue={this.setSubInputValue}
                            DeleteItem={this.deleteItem} />
                    )
                    }
                            </div>
                        <div className="form-action text-center">
                            <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }
                            <button type="button" onClick={this.props.noneType}><i className="fa-times"></i> 回前頁</button>
                            </div>
                    </div>
            );

            return outHtml;
        }
    }

    interface DetailFieldState {
        fieldData?: server.BrandDetail,
        edit_type?: number,
        open?: boolean
    }
    interface DetailFieldProps {
        fieldData: server.BrandDetail,
        iKey: number,
        key: string,
        setSubInputValue(i: number, name: string, e: React.SyntheticEvent): void,
        DeleteItem(i: number): void,
    }
    //明細表單
    export class GridDetailField extends React.Component<DetailFieldProps, DetailFieldState>{

        constructor() {

            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.deleteItem = this.deleteItem.bind(this);
            this.render = this.render.bind(this);
            this.state = {
                fieldData: {},
                edit_type: 0,
                open: true
            }
        }
        static defaultProps = {
            apiDetailPath: gb_approot + 'api/BrandDetail'
        }
        componentDidMount() {
            let fieldData = this.props.fieldData;
            this.setState({ fieldData: fieldData });
        }
        changeFDValue(name: string, e: React.SyntheticEvent) {
            this.props.setSubInputValue(this.props.iKey, name, e);
        }
        deleteItem(i: number) {
            if (this.props.fieldData.edit_state == 1) {
                if (confirm('此筆資料已存在，確認是否刪除?')) {
                    this.props.DeleteItem(i);
                }
            } else {
                this.props.DeleteItem(i);
            }
        }
        render() {

            var outHtml: JSX.Element = null;

            let fieldData = this.state.fieldData;
            let Collapse = ReactBootstrap.Collapse;

            outHtml = (
                <div className="panel" data-id={this.props.iKey}>
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <a className="draggable" href="#">
                                <i className="fa-bars"></i>
                                #{this.props.iKey}
                                <ul className="widget">
                                    <li><button onClick={() => this.setState({ open: !this.state.open }) } type="button" title="收合/展開" className="btn-link text-default"><i className="fa-chevron-down"></i></button></li>
                                    <li><button className="btn-link text-danger" type="button" title="刪除" onClick={this.deleteItem.bind(this, this.props.iKey) }><i className="fa-times"></i></button></li>
                                    </ul>
                                </a>
                            </h4>
                        </div>
                    <Collapse in={this.state.open}>
                        <div className="panel-body">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">次分類名稱</label>
                                    <div className="col-xs-7">
                                        <input type="text" className="form-control" value={fieldData.detail_name} onChange={this.changeFDValue.bind(this, 'detail_name') } maxLength={64} required/>
                                        </div>
                                    <small className="col-xs-3 help-inline"><span className="text-danger">(必填) </span>, 最多64字</small>
                                    </div>
                                {/*<div className="form-group">
                                    <label className="col-xs-1 control-label">連結</label>
                                    <div className="col-xs-8">
                                        <input type="text" className="form-control" value={fieldData.link_url} onChange={this.changeFDValue.bind(this, 'link_url') } maxLength={256} required/>
                                        </div>
                                    <small className="col-xs-3 help-inline"><span className="text-danger">(必填) </span>, 最多256字</small>
                                    </div>*/}
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">排序</label>
                                    <div className="col-xs-7">
                                        <input type="number" className="form-control"value={fieldData.sort} onChange={this.changeFDValue.bind(this, 'sort') } required />
                                        </div>
                                    <small className="col-xs-3 help-inline">數字越大越前面</small>
                                    </div>
                                </div>

                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">首頁輪播圖</label>
                                    <div className="col-xs-8">
                                       <CommCmpt.MasterImageUpload FileKind="Banner" MainId={fieldData.brand_detail_id} ParentEditType={fieldData.edit_state + 1} url_upload={gb_approot + 'Active/BrandData/aj_FUpload'} url_list={gb_approot + 'Active/BrandData/aj_FList'}
                                           url_delete={gb_approot + 'Active/BrandData/aj_FDelete'} />
                                        <small className="help-block">最多1張圖，建議尺寸 200*160 px, 每張圖最大不可超過2MB</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Collapse>


                    </div>
            );

            return outHtml;
        }
    }
}

var dom = document.getElementById('page_content');
ReactDOM.render(<Brand.GridForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);