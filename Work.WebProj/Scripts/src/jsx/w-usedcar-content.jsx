var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');

var CarContent = React.createClass({
    getInitialState: function () {
        return {
            field: {
                base: {}
            }
        };
    },
    getDefaultProps: function () {
        return {
            sym_web_api: 'http://symb2b.sym-motor.com.tw/Wau_New/',
            sym_Web_pic: 'http://symb2b.sym-motor.com.tw/wau/pic/'
        };
    },
    componentDidMount: function () {
        $.get(this.props.sym_web_api + 'api_content.asp', { h_auc_no: this.props.h_auc_no, h_obj_no: this.props.h_obj_no })
        .done(function (data) {
            this.setState({ field: data });
        }.bind(this));
    },
    render: function () {
        let outHtml = null;

        var base = this.state.field.base;

        outHtml =
        <div>
            <div className="grid-info">
                <div className="wrap">
                    <h2 className="h1 text-xs-left">
                        <small>結束時間：{base.end_date} {base.end_time}</small>
                        拍賣編號
                        <strong>{base.auc_no}</strong>
                        <span className="price text-danger">直購價：${base.d_price}</span>
                    </h2>
                    <div className="gallery row">
                        <div id="banner">
                            <div className="swiper-container">
                                <ul className="swiper-wrapper list-unstyled">
                                    <li className="swiper-slide"><img src="/Content/images/Index/banner1.jpg" alt="" /></li>
                                    <li className="swiper-slide"><img src="/Content/images/UsedCar/pro1-2.jpg" alt="" /></li>
                                    <li className="swiper-slide"><img src="/Content/images/UsedCar/pro1-1.jpg" alt="" /></li>
                                    <li className="swiper-slide"><img src="/Content/images/UsedCar/pro1-2.jpg" alt="" /></li>
                                    <li className="swiper-slide"><img src="/Content/images/UsedCar/pro1-1.jpg" alt="" /></li>
                                    <li className="swiper-slide"><img src="/Content/images/UsedCar/pro1-2.jpg" alt="" /></li>
                                    <li className="swiper-slide"><img src="/Content/images/UsedCar/pro1-1.jpg" alt="" /></li>
                                    <li className="swiper-slide"><img src="/Content/images/UsedCar/pro1-2.jpg" alt="" /></li>
                                    <li className="swiper-slide"><img src="/Content/images/UsedCar/pro1-1.jpg" alt="" /></li>
                                </ul>
                            </div>
                        </div>
                        <div id="banner-thumb">
                            <ul className="list-unstyled">
                                <li><img src="/Content/images/UsedCar/pro1-1.jpg" alt="" /></li>
                                <li><img src="/Content/images/UsedCar/pro1-2.jpg" alt="" /></li>
                                <li><img src="/Content/images/UsedCar/pro1-1.jpg" alt="" /></li>
                                <li><img src="/Content/images/UsedCar/pro1-2.jpg" alt="" /></li>
                                <li><img src="/Content/images/UsedCar/pro1-1.jpg" alt="" /></li>
                                <li><img src="/Content/images/UsedCar/pro1-2.jpg" alt="" /></li>
                                <li><img src="/Content/images/UsedCar/pro1-1.jpg" alt="" /></li>
                                <li><img src="/Content/images/UsedCar/pro1-2.jpg" alt="" /></li>
                                <li><img src="/Content/images/UsedCar/pro1-1.jpg" alt="" /></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-info">
                <div className="wrap">
                    <h3 className="sr-only">車況介紹</h3>
                    <div className="row">
                        <dl className="info">
                            <dt className="icon"><i className="ti-car"></i></dt>
                            <dd>
                                <ul className="list-unstyled">
                                    <li><em>廠牌：</em> {base.obj_brand}</li>
                                    <li><em>車型：</em> {base.obj_type}</li>
                                    <li><em>車色：</em> {base.obj_color}</li>
                                    <li><em>年份：</em> {base.ori_year}</li>
                                    <li><em>地點：</em> {base.dept_cname}</li>
                                </ul>
                            </dd>
                        </dl>
                        <dl className="info">
                            <dt className="icon"><i className="ti-settings"></i></dt>
                            <dd>
                                <ul className="list-unstyled">
                                    <li><em>排氣量：</em>{base.obj_cc}</li>
                                    <li><em>里程數(數據僅供參考)：</em>約 {base.run_km}</li>
                                    <li><em>排檔：</em><RunType value={base.run_type}></RunType></li>
                                    <li><em>胎深：</em>{base.tire_deep}</li>
                                </ul>
                            </dd>
                        </dl>
                        <dl className="info">
                            <dt className="icon"><i className="ti-notepad"></i></dt>
                            <dd>
                                <ul className="list-unstyled">
                                    <li><em>原廠證件：</em>{base.obj_dou_txt}</li>
                                    <li><em>監理站：</em>暫無資料</li>
                                    <li><em>引擎號碼：</em>暫無資料</li>
                                    <li><em>領牌日：</em>暫無資料</li>
                                    <li><em>原車價：</em>${base.list_ori_price}</li>
                                    <li><em>車輛整備表下載：</em>暫無資料</li>
                                </ul>
                            </dd>
                        </dl>
                        <dl className="detail">
                            <dt>配備：</dt>
                            <dd>天窗、CD音響、衛星導航、定速、電動後視鏡、安全氣囊、4WD、皮椅、VCD、恆溫、ABS、倒車雷達、霧燈、電動座椅、DVD、防盜、TCS、鋁圈、電動窗</dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="grid-info">
                <div className="wrap">
                    <article className="article">
                        <h2 className="h1">購買須知</h2>
                        <ul className="notice list-unstyled">
                            <li><em>配備說明</em>{base.memo}</li>
                            <li><em>車　　況</em>{base.descri}</li>
                            <li><em>備　　註</em>{base.memo1}</li>
                            <li><em>注意事項</em>1. 請於完款後三天內至監理站為過戶登記，相關費用需自行承擔。<br />2. 若需托運，其運費依規定辦理。</li>
                        </ul>
                    </article>
                </div>
            </div>
        </div>;
        return outHtml;
    }
})

var RunType = React.createClass({
    render: function () {
        var outHtml = <span>-</span>;
        if (this.props.value == '1') {
            outHtml = <span>手排</span>;
        }
        if (this.props.value == '2') {
            outHtml = <span>自排</span>;
        }
        if (this.props.value == '3') {
            outHtml = <span>手自排</span>;
        }
        return outHtml;
    }
});

var dom = document.getElementById('content');
ReactDOM.render(<CarContent h_auc_no={h_auc_no} h_obj_no={h_obj_no } />, dom);
