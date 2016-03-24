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
        category_name?: string,
        brand_name?: string;
        sort?: number;
        i_Hide?: boolean;
    }
    interface FormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        searchData?: {
            keyword: string,
            category_id: number
        }
        option_category?: server.BrandCategory[]
    }
    interface FormResult extends IResultBase {
        id: string
    }
    //---相簿---
    //主檔新增
    class HandleBrandAlbum extends React.Component<{ brand_id: number, parent_edit_type: number, apiPath?: string },
        { albums?: Array<server.BrandAlbum>, album_name?: string }> {
        constructor() {
            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.query = this.query.bind(this);
            this.delItem = this.delItem.bind(this);
            this.submit = this.submit.bind(this);
            this.updateSubmit = this.updateSubmit.bind(this);
            this.onChange = this.onChange.bind(this);
            this.setSubInputValue = this.setSubInputValue.bind(this);
            this.state = {
                albums: [], album_name: null
            };
        }
        static defaultProps = {
            apiPath: gb_approot + 'api/BrandAlbum'
        }

        private query() {
            CommFunc.jqGet(this.props.apiPath, { brand_id: this.props.brand_id })
                .done((data: Array<server.BrandAlbum>, textStatus, jqXHRdata) => {
                    this.setState({
                        album_name: null,
                        albums: data
                    });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        componentDidMount() {
            this.query();
        }
        delItem(i: number, e: React.SyntheticEvent) {

            let obj = this.state.albums;
            let item = obj[i];

            CommFunc.jqDelete(this.props.apiPath + '?id=' + item.brand_album_id, {})
                .done((data, textStatus, jqXHRdata) => {
                    if (data.result) {
                        this.query();
                    } else {
                        alert(data.message);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        submit() {
            if (this.state.albums.length >= 6) {
                alert('超過數量上限,最多可新增六個相簿！');
                return;
            }
            if (this.state.album_name != null) {
                if (this.state.album_name.trim() == '') {
                    alert('相簿名稱未填寫！');
                    return;
                }
            } else if (this.state.album_name == null) {
                alert('相簿名稱未填寫！');
                return;
            }

            if (this.props.parent_edit_type == 1) {
                alert('請先按最下方【儲存】後，再新增相簿！');
                return;
            }
            let sort: number = 1;
            let last_item: server.BrandAlbum;

            if (this.state.albums.length > 0) {
                last_item = this.state.albums[this.state.albums.length - 1];
                sort = last_item.sort + 1;
            }

            var new_obj: server.BrandAlbum = {
                brand_id: this.props.brand_id,
                album_name: this.state.album_name.trim(),
                sort: sort
            };

            CommFunc.jqPost(this.props.apiPath, new_obj)
                .done((data, textStatus, jqXHRdata) => {
                    this.query();
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        updateSubmit(i: number, details: Array<server.BrandAlbumDetail>) {
            let obj = this.state.albums;
            let item = obj[i];

            item.BrandAlbumDetail = details;
            CommFunc.jqPut(this.props.apiPath, item)
                .done((data, textStatus, jqXHRdata) => {
                    if (data.result) {
                        CommFunc.tosMessage(null, '相簿內容修改完成！', 1);
                        this.query();
                    } else {
                        alert(data.message);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        cancel() {
            let obj = this.state.albums;
            obj.splice(-1, 1);
            this.setState({ albums: obj });
        }
        onChange(e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            this.setState({ album_name: input.value });
        }
        setSubInputValue(i: number, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.albums;
            let item = obj[i];
            if (input.value == 'true') {
                item[name] = true;
            } else if (input.value == 'false') {
                item[name] = false;
            } else {
                item[name] = input.value;
            }

            this.setState({ albums: obj });
        }

        render() {
            return (
                <div>
                    <div className="alert alert-warning">要刪除相簿之前，請先將相簿內的圖片全部刪除才可刪除相簿。</div>
                    <div className="form-group">
                        <label className="col-xs-1">新增相簿</label>
                        <div className="col-xs-8">
                            <div className="input-group">
                                <input type="text" className="form-control" value={this.state.album_name} onChange={this.onChange} placeholder="請輸入相簿名稱..." />
                                <span className="input-group-btn">
                                    <button type="button" className="btn-success" onClick={this.submit}><i className="fa-plus"></i> 新增</button>
                                </span>
                            </div>
                            <small className="help-block">最多可新增6組相簿，每組相簿最多可新增12張圖片，每張圖檔案最大不可超過2MB</small>
                        </div>
                    </div>
                    <hr className="condensed" />
                    <div>
                        {this.state.albums.map((item, i) => {
                            return <GridAlbumField key={i + '-' + item.brand_album_id} iKey={i} fieldData={item}
                            setSubInputValue={this.setSubInputValue} DeleteItem={this.delItem} updateSubmit={this.updateSubmit}/>
                        }) }
                    </div>
                </div>
            );
        }
    }

    //主檔list
    interface AlbumFieldState {
        fieldData?: server.BrandAlbum,
        open?: boolean
    }
    interface AlbumFieldProps {
        fieldData: server.BrandAlbum,
        iKey: number,
        key: string,
        setSubInputValue(i: number, name: string, e: React.SyntheticEvent): void,
        DeleteItem(i: number, e: React.SyntheticEvent): void,
        updateSubmit(i: number, details: Array<server.BrandAlbumDetail>): void
    }
    export class GridAlbumField extends React.Component<AlbumFieldProps, AlbumFieldState>{

        constructor() {

            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.deleteItem = this.deleteItem.bind(this);
            this.updateSubmit = this.updateSubmit.bind(this);
            this.render = this.render.bind(this);
            this.state = {
                fieldData: {},
                open: true
            }
        }
        static defaultProps = {
            apiDetailPath: gb_approot + 'api/BrandAlbumDetail'
        }
        componentDidMount() {
            let fieldData = this.props.fieldData;
            this.setState({ fieldData: fieldData });
        }
        changeFDValue(name: string, e: React.SyntheticEvent) {
            this.props.setSubInputValue(this.props.iKey, name, e);
        }
        deleteItem(i: number, e: React.SyntheticEvent) {
            this.props.DeleteItem(i, e);
        }
        updateSubmit(i: number, e: React.SyntheticEvent) {
            let details = (this.refs["AlbumDetail"]).state.details;
            this.props.updateSubmit(i, details);
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
                                #{this.props.iKey} {fieldData.album_name}
                                <ul className="widget">
                                    <li><button onClick={() => this.setState({ open: !this.state.open }) } type="button" title="收合/展開" className="btn-link text-default"><i className="fa-chevron-down"></i></button></li>
                                    <li><button className="btn-link text-danger" type="button" title="刪除" onClick={this.deleteItem.bind(this, this.props.iKey) }><i className="fa-times"></i></button></li>
                                </ul>
                            </a>
                        </h4>
                    </div>
                    <Collapse in={this.state.open}>
                        <div>
                            <div className="panel-body">
                                <div className="form-group">
                                    <label className="col-xs-1 control-label">代表圖</label>
                                    <div className="col-xs-4">
                                        <CommCmpt.MasterImageUpload FileKind="Album" MainId={this.props.fieldData.brand_album_id} ParentEditType={2} url_upload={gb_approot + 'Active/BrandData/aj_FUpload'} url_list={gb_approot + 'Active/BrandData/aj_FList'}
                                            url_delete={gb_approot + 'Active/BrandData/aj_FDelete'} />
                                    </div>
                                    <label className="col-xs-1 control-label">排序</label>
                                    <div className="col-xs-1">
                                        <input className="form-control" type="number" value={fieldData.sort} onChange={this.changeFDValue.bind(this, 'sort') } required/>
                                    </div>
                                    <small className="col-xs-2 help-inline">數字大在前面</small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-1 control-label">相簿名稱</label>
                                    <div className="col-xs-4">
                                        <input className="form-control" type="text" value={fieldData.album_name} onChange={this.changeFDValue.bind(this, 'album_name') } maxLength={64} required/>
                                    </div>
                                    <small className="col-xs-2 help-inline">最多64字</small>
                                </div>
                                <HandleAlbumDetail ref="AlbumDetail" brand_album_id={this.props.fieldData.brand_album_id} parent_edit_type={2}/>
                            </div>
                            <div className="panel-footer">
                                <button type="button" onClick={this.updateSubmit.bind(this, this.props.iKey) } className="btn-primary"><i className="fa-check"></i> 相簿存檔</button>
                                <small className="text-muted">　如有修改此相簿的相簿名稱或圖說，請記得先按【相簿存檔】再上傳圖片。</small>
                            </div>
                        </div>
                    </Collapse>
                </div>
            );
            
            return outHtml;
        }
    }
    //明細檔
    class HandleAlbumDetail extends React.Component<{ brand_album_id: number, apiPath?: string, parent_edit_type: number, ref: string },
        { details?: Array<server.BrandAlbumDetail> }> {
        constructor() {
            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.query = this.query.bind(this);
            this.delItem = this.delItem.bind(this);
            this.submit = this.submit.bind(this);
            this.setSubInputValue = this.setSubInputValue.bind(this);
            this.state = {
                details: []
            };
        }
        static defaultProps = {
            apiPath: gb_approot + 'api/BrandAlbumDetail'
        }

        private query() {
            CommFunc.jqGet(this.props.apiPath, { brand_album_id: this.props.brand_album_id })
                .done((data: Array<server.BrandAlbumDetail>, textStatus, jqXHRdata) => {
                    this.setState({ details: data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        componentDidMount() {
            this.query();
        }
        delItem(i: number, e: React.SyntheticEvent) {

            let obj = this.state.details;
            let item = obj[i];

            CommFunc.jqDelete(this.props.apiPath + '?id=' + item.brand_album_detail_id, {})
                .done((data: Array<server.BrandAlbumDetail>, textStatus, jqXHRdata) => {
                    this.query();
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        submit() {
            if (this.state.details.length >= 12) {
                alert('超過數量上限，每個相簿最多新增12張圖片!');
                return;
            }
            if (this.props.parent_edit_type == 1) {
                alert('請先按相簿存檔後，再新增！');
                return;
            }
            let sort: number = 1;
            let last_item: server.BrandAlbumDetail;
            if (this.state.details.length > 0) {
                last_item = this.state.details[this.state.details.length - 1];
                sort = last_item.sort + 1;
            }
            var new_obj: server.BrandAlbumDetail = {
                brand_album_id: this.props.brand_album_id,
                detail_name: null,//先新增,後填寫圖說
                sort: sort
            };

            CommFunc.jqPost(this.props.apiPath, new_obj)
                .done((data, textStatus, jqXHRdata) => {
                    this.query();
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        setSubInputValue(i: number, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.details;
            let item = obj[i];
            if (input.value == 'true') {
                item[name] = true;
            } else if (input.value == 'false') {
                item[name] = false;
            } else {
                item[name] = input.value;
            }

            this.setState({ details: obj });
        }
        render() {
            return (
                <div>
                    <h5>
                        <button type="button" className="btn-link text-success text-lg" onClick={this.submit}><i className="fa-plus-circle"></i> 新增圖片</button>
                    </h5>
                    <div className="list-unstyled row">
                        {this.state.details.map((item, i) => {
                            return <div key={item.brand_album_detail_id} className="col-xs-4">
                                <div className="thumbnail" style={{ "height": "167px", "margin-bottom": "10px" }}>
                                    <button type="button" className="pull-right btn-link text-danger" onClick={this.delItem.bind(this, i) }><i className="fa-trash-o"></i> 刪除</button>
                                    <input type="text" className="form-control" style={{"margin-bottom": "5px"}} value={item.detail_name} onChange={this.setSubInputValue.bind(this, i, 'detail_name') } placeholder="請輸入圖片說明..." />
                                    <CommCmpt.MasterImageUpload FileKind="AlbumList" MainId={item.brand_album_detail_id} ParentEditType={this.props.parent_edit_type} url_upload={gb_approot + 'Active/BrandData/aj_FUpload'} url_list={gb_approot + 'Active/BrandData/aj_FList'}
                                    url_delete={gb_approot + 'Active/BrandData/aj_FDelete'} />
                                </div>
                            </div>
                        }) }
                    </div>
                </div>
            );
        }
    }
    //---相簿---
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
                       <td>{this.props.itemData.category_name}</td>
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
            this.componentDidUpdate = this.componentDidUpdate.bind(this);
            this.queryInitData = this.queryInitData.bind(this);
            this.render = this.render.bind(this);


            this.state = {
                fieldData: {},
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null, category_id: null },
                option_category: []
            }
        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Brand',
            apiInitPath: gb_approot + 'Active/BrandData/aj_Init'
        }
        componentDidMount() {
            this.queryGridData(1);
            this.queryInitData();
        }
        componentDidUpdate(prevProps, prevState) {
            if ((prevState.edit_type == 0 && (this.state.edit_type == 1 || this.state.edit_type == 2))) {
                console.log('CKEDITOR');
                CKEDITOR.replace('feature', { customConfig: '../ckeditor/inlineConfig.js' });
                CKEDITOR.replace('specification', { customConfig: '../ckeditor/inlineConfig.js' });
                CKEDITOR.replace('news', { customConfig: '../ckeditor/inlineConfig.js' });
            }
        }
        queryInitData() {
            CommFunc.jqGet(this.props.apiInitPath, {})
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ option_category: data.data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
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
            this.state.fieldData.feature = CKEDITOR.instances['feature'].getData();
            this.state.fieldData.specification = CKEDITOR.instances['specification'].getData();
            this.state.fieldData.news = CKEDITOR.instances['news'].getData();
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
            this.setState({ edit_type: 1, fieldData: { i_Hide: false, sort: 0, brand_category_id: this.state.option_category[0].brand_category_id } });
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
            let option = this.state.option_category;

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
                                            <label>分類</label> { }
                                            <select className="form-control"
                                                id="search-category"
                                                onChange={this.changeGDValue.bind(this, 'category_id') }
                                                value={searchData.category_id} >
                                                <option value="">全部</option>
                                                {
                                                option.map((itemData, i) => <option key={i} value={itemData.brand_category_id}>{itemData.category_name}</option>)
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
                                        <th className="col-xs-2">分類</th>
                                        <th className="col-xs-4">標題</th>
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
                var Tabs = ReactBootstrap.Tabs;
                var Tab = ReactBootstrap.Tab;

                outHtml = (
                    <div>
                        <h4 className="title"> {this.props.caption} 基本資料維護</h4>
                        <form className="form-horizontal" onSubmit={this.handleSubmit}>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">代表圖</label>
                                    <div className="col-xs-8">
                                       <CommCmpt.MasterImageUpload FileKind="Banner" MainId={fieldData.brand_id} ParentEditType={this.state.edit_type} url_upload={gb_approot + 'Active/BrandData/aj_FUpload'} url_list={gb_approot + 'Active/BrandData/aj_FList'}
                                           url_delete={gb_approot + 'Active/BrandData/aj_FDelete'} />
                                        <small className="help-block">最多1張圖，檔案最大不可超過2MB</small>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">車款名稱</label>
                                    <div className="col-xs-7">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'brand_name') } value={fieldData.brand_name} maxLength={64} required />
                                    </div>
                                    <small className="col-xs-3 help-inline"><span className="text-danger">(必填) </span>, 最多64字</small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">分類</label>
                                    <div className="col-xs-7">
                                        <select className="form-control" id="field-category"
                                            onChange={this.changeFDValue.bind(this, 'brand_category_id') }
                                            value={fieldData.brand_category_id}>
                                                {
                                                option.map((itemData, i) => <option key={i} value={itemData.brand_category_id}>{itemData.category_name}</option>)
                                                }
                                        </select>
                                    </div>
                                    <small className="help-inline col-xs-2 text-danger">(必填) </small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">排序</label>
                                    <div className="col-xs-7">
                                        <input type="number" className="form-control" onChange={this.changeFDValue.bind(this, 'sort') } value={fieldData.sort}  />
                                    </div>
                                    <small className="col-xs-3 help-inline">數字越大越前面</small>
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
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">車價</label>
                                    <div className="col-xs-7">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'price') } value={fieldData.price} maxLength={64}  />
                                    </div>
                                    <small className="col-xs-3 help-inline"><span className="text-danger"></span>最多64字</small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">車色</label>
                                    <div className="col-xs-7">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'colors') } value={fieldData.colors} maxLength={128}  />
                                    </div>
                                    <small className="col-xs-3 help-inline"><span className="text-danger"></span>最多128字</small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">乘客數</label>
                                    <div className="col-xs-7">
                                        <div className="input-group">
                                            <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'seat') } value={fieldData.seat} maxLength={128} />
                                            <span className="input-group-addon">人座</span>
                                        </div>
                                    </div>
                                    <small className="col-xs-3 help-inline"><span className="text-danger"></span>最多128字</small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">排氣量</label>
                                    <div className="col-xs-7">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'engine_displacement') } value={fieldData.engine_displacement} maxLength={128}  />
                                    </div>
                                    <small className="col-xs-3 help-inline"><span className="text-danger"></span>最多128字</small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">排檔方式</label>
                                    <div className="col-xs-7">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'gearshift') } value={fieldData.gearshift} maxLength={128}  />
                                    </div>
                                    <small className="col-xs-3 help-inline"><span className="text-danger"></span>最多128字</small>
                                </div>
                            </div>
                            <div className="col-xs-12">
                                <div className="item-box">
                                    <div className="item-title"><h5>內裝/外觀</h5></div>
                                    <div className="panel-body">
                                        <HandleBrandAlbum brand_id={this.state.fieldData.brand_id} parent_edit_type={this.state.edit_type} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12">
                                <Tabs defaultActiveKey={1} animation={false}>
                                    <Tab eventKey={1} title="特色">
                                        <textarea type="date" className="form-control" id="feature" name="feature" value={fieldData.feature} onChange={this.changeFDValue.bind(this, 'feature') } />
                                        </Tab>
                                    <Tab eventKey={2} title="規格表">
                                        <textarea type="date" className="form-control" id="specification" name="specification" value={fieldData.specification} onChange={this.changeFDValue.bind(this, 'specification') } />
                                        </Tab>
                                    <Tab eventKey={3} title="媒體報導">
                                        <textarea type="date" className="form-control" id="news" name="news" value={fieldData.news} onChange={this.changeFDValue.bind(this, 'news') } />
                                        </Tab>
                                </Tabs>
                            </div>
                            <div className="col-xs-12">
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
ReactDOM.render(<Brand.GridForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);