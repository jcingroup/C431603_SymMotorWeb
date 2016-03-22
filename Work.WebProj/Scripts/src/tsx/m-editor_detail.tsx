import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import DT = require('dt');

namespace EditorDetail {
    interface Rows {
        editor_id?: string;
        check_del?: boolean,
        name?: string;
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
    export class GridForm extends React.Component<BaseDefine.GridFormPropsBase, FormState<Rows, server.Editor>>{

        constructor() {

            super();
            this.updateType = this.updateType.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.changeGDValue = this.changeGDValue.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
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
            apiPath: gb_approot + 'api/Editor'
        }
        componentDidMount() {
            this.updateType(gb_id);
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
                this.state.fieldData.EditorDetail = (this.refs["GridDetailForm"]).state.gridData;
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
        updateType(id: number | string) {

            CommFunc.jqGet(this.props.apiPath, { id: id })
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ edit_type: 2, fieldData: data.data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
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

            if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let fieldData = this.state.fieldData;
                let InputDate = CommCmpt.InputDate;

                outHtml = (
                    <div>
                        <h4 className="title"> {this.props.caption} 基本資料維護</h4>
                        <form className="form-horizontal" onSubmit={this.handleSubmit}>
                            <div className="col-xs-12">
                                <GridDetailForm
                                    MainId={fieldData.editor_id}
                                    ref="GridDetailForm" />
                                </div>
                            </form>
                        </div>
                );
            }

            return outHtml;
        }
    }

    interface DetailFormState {
        gridData?: server.EditorDetail[];
    }
    interface DetailFormProps {
        MainId: number,
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

            this.render = this.render.bind(this);
            this.state = {
                gridData: []
            }
        }
        static defaultProps = {
            apiDetailPath: gb_approot + 'api/EditorDetail'
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
            //if (input.value == 'true') {
            //    obj[name] = true;
            //} else if (input.value == 'false') {
            //    obj[name] = false;
            //} else {
            //    obj[name] = input.value;
            //}
            if (name == "detail_content") {
                obj[name] = CKEDITOR.instances['content-' + i].getData();
            }
            this.setState({ gridData: gridData });
        }
        render() {

            var outHtml: JSX.Element = null;
            var Tabs = ReactBootstrap.Tabs;
            var Tab = ReactBootstrap.Tab;

            outHtml = (
                <div className="col-xs-12">
                        <Tabs defaultActiveKey={0} animation={false}>
                    {
                    this.state.gridData.map((itemData, i) =>
                        <Tab eventKey={i} title={itemData.detail_name} key={itemData.editor_detail_id}>
                                <GridDetailField key={i + '-' + itemData.editor_detail_id} iKey={i} fieldData={itemData}
                                    setSubInputValue={this.setSubInputValue} />
                            </Tab>
                    ) }
                            </Tabs>
                        <div className="form-action text-center">
                            <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }
                            </div>
                    </div>
            );

            return outHtml;
        }
    }
    interface DetailFieldState {
        fieldData?: server.EditorDetail,
        editorObj?: any,
        open?: boolean
    }
    interface DetailFieldProps {
        fieldData: server.EditorDetail,
        iKey: number,
        key: string,
        setSubInputValue(i: number, name: string, e: React.SyntheticEvent): void,
    }
    //明細表單
    export class GridDetailField extends React.Component<DetailFieldProps, DetailFieldState>{

        constructor() {

            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.setEditor = this.setEditor.bind(this);
            this.render = this.render.bind(this);
            this.state = {
                fieldData: {},
                editorObj: null,
                open: true
            }
        }
        static defaultProps = {
            apiDetailPath: gb_approot + 'api/EditorDetail'
        }
        componentDidMount() {
            let fieldData = this.props.fieldData;
            this.setState({ fieldData: fieldData });

            this.setEditor('content-' + this.props.iKey, fieldData.detail_content);
        }
        changeFDValue(name: string, e: React.SyntheticEvent) {
            this.props.setSubInputValue(this.props.iKey, name, e);
        }
        setEditor(editorName: string, content: string) {
            let editorObj = this.state.editorObj;

            //CKEDITOR.disableAutoInline = true;
            var cfg2 = { customConfig: '../ckeditor/inlineConfig.js' }
            //editorObj = CKEDITOR.inline(editorName, cfg2);
            editorObj = CKEDITOR.replace(editorName, cfg2);
            editorObj.setData(content);//一開始載入會沒資料
            let _this = this;
            editorObj.on('change', function (evt) {
                _this.changeFDValue('detail_content', evt);
            });
        }
        render() {

            var outHtml: JSX.Element = null;

            let fieldData = this.state.fieldData;

            outHtml = (
                <div className="panel-body">
                    <textarea className="form-control" rows={4} id={'content-' + this.props.iKey}
                        name={'content-' + this.props.iKey}
                        value={fieldData.detail_content}
                        onChange={this.changeFDValue.bind(this, 'detail_content') } />
                    </div>
            );

            return outHtml;
        }
    }
}

var dom = document.getElementById('page_content');
ReactDOM.render(<EditorDetail.GridForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);