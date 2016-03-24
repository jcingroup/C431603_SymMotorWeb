var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');

var CarContent = React.createClass({
    getInitialState: function () {
        return {
            field: {
                base: {},
                pic: []
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

            var banner = new Swiper('#banner .swiper-container', {
                autoplay: 2500,
                autoplayDisableOnInteraction: 'false',
                speed: 1000,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
            });
            var bannerThumb = new Swiper('#banner-thumb .swiper-container', {
                spaceBetween: 10,
                slidesPerView: 5,
                autoplay: 2500,
                autoplayDisableOnInteraction: 'false',
                speed: 1000,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
            });
            $("#banner-thumb").on('click', 'li', function () {
                banner.slideTo($(this).index(), 1000);
            });

        }.bind(this));
    },
    formatNumber: function (number) {
        if (number == undefined || number == null) {
            return '';
        }
        var number = number.toFixed(2) + '';
        var x = number.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        //return x1 + x2;
        return x1;
    },
    showEquip: function () {
        var equip = {
            EQ_18: '鋁圈',
            EQ_19: '電動窗',
            //OBJ_NO: '車牌號碼',
            EQ_1: '天窗',
            EQ_2: 'CD音響',
            EQ_3: '衛星導航',
            EQ_4: '定速',
            EQ_5: '電動後視鏡',
            EQ_6: '安全氣囊',
            EQ_7: '4WD',
            EQ_8: '皮椅',
            EQ_9: 'VCD',
            EQ_10: '恆溫',
            EQ_11: 'ABS',
            EQ_12: '倒車雷達',
            EQ_13: '霧燈',
            EQ_14: '電動座椅',
            EQ_15: 'DVD',
            EQ_16: '防盜',
            EQ_17: 'TCS'
        }
        var obj = this.state.field.base;
        var hasEquip = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && equip.hasOwnProperty(prop)) {
                var v = obj[prop];
                if (v == 'Y') {
                    var n = equip[prop];
                    hasEquip.push(n);
                }
            }
        }
        return hasEquip;
    },
    render: function () {
        let outHtml = null;

        var base = this.state.field.base;
        var pic = this.state.field.pic;
        var equips = this.showEquip();

        outHtml =
        <div>
            <div className="grid-info">
                <div className="wrap">
                    <h2 className="h1 text-xs-left">
                        <small>結束時間：{base.end_date} {base.end_time}</small>
                        拍賣編號
                        <strong>{base.auc_no}</strong>
                        <span className="price text-danger">直購價：${this.formatNumber(base.d_price)}</span>
                    </h2>
                    <div className="gallery row">
                        <div id="banner">
                            <div className="swiper-container">
                                <ul className="swiper-wrapper list-unstyled">
                                    {
                                        pic.map(function (item, i) {
                                            return (
                                            <li className="swiper-slide">
                                                <img src={this.props.sym_Web_pic + base.obj_no + '_' + item + '.jpg' } alt="" />
                                            </li>);
                                        }.bind(this))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div id="banner-thumb">
                            <ul className="list-unstyled">
                                {
                                    pic.map(function (item, i) {
                                        return (
                                        <li><img src={this.props.sym_Web_pic + base.obj_no + '_' + item + '.jpg' } alt="" /></li>);
                                    }.bind(this))
                                }
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
                            <dd>{equips}</dd>
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

        outHtml = (
        <div>
            <div className="grid-info">
                <div className="wrap">

            <h2 className="h1 text-xs-left">
                <small className="meta">
                    <span className="label label-danger">拍賣編號：{base.auc_no}</span>
                    <span className="text-muted">結束時間：{base.end_date} {base.end_time}</span>
                </small>
                <ul className="title list-inline">
                    <li>{base.obj_brand}</li>
                    <li>{base.obj_type}</li>
                    <li>{base.ori_year} 年</li>
                    <li className="price text-danger">直購價：${this.formatNumber(base.d_price)}萬</li>
                </ul>
            </h2>

            <dl className="row">
                <dt className="gallery">
                    <div id="banner">
                        <div className="swiper-container">
                            <ul className="swiper-wrapper list-unstyled">
                                {
                                pic.map(function (item, i) {
                                    return (
                                            <li className="swiper-slide">
                                                <img src={this.props.sym_Web_pic + base.obj_no + '_' + item + '.jpg' } alt="" />
                                            </li>);
                                }.bind(this))
                                }
                            </ul>
                            <a className="prev swiper-button-prev" href=""></a>
                            <a className="next swiper-button-next" href=""></a>
                        </div>
                    </div>
                    <div id="banner-thumb">
                        <div className="swiper-container">
                            <ul className="swiper-wrapper list-unstyled">
                                {
                                pic.map(function (item, i) {
                                    return (
                                        <li className="swiper-slide"><img src={this.props.sym_Web_pic + base.obj_no + '_' + item + '.jpg' } alt="" /></li>);
                                }.bind(this))
                                }
                            </ul>
                            <a className="prev swiper-button-prev" href=""></a>
                            <a className="next swiper-button-next" href=""></a>
                        </div>
                    </div>
                </dt>
                <dd className="info">
                    <ul className="list-unstyled">
                        <li><strong>拍賣編號：</strong>{base.auc_no}</li>
                        <li><strong>廠牌：</strong>{base.obj_brand}</li>
                        <li><strong>車型：</strong>{base.obj_type}</li>
                        <li><strong>細車型：</strong>{base.obj_model}</li>
                        <li><strong>顏色：</strong>{base.obj_color}</li>
                        <li><strong>排氣量：</strong>{base.obj_cc}</li>
                        <li><strong>年份：</strong>{base.ori_year}</li>
                        <li><strong>里程數：</strong>約 {base.run_km} <small>(數據僅供參考)</small></li>
                        <li><strong>排檔：</strong><RunType value={base.run_type}></RunType></li>
                        <li><strong>存放地：</strong>{base.dept_cname}</li>
                        <li><strong>胎深：</strong>{base.tire_deep}</li>
                        <li><strong>原廠證件：</strong>{base.obj_dou_txt}</li>
                        <li><strong>監理站：</strong>-</li>
                        <li><strong>引擎號碼：</strong>-</li>
                        <li><strong>領牌日：</strong>-</li>
                        <li><strong>原車價：</strong>${this.formatNumber(base.list_ori_price)}</li>
                        <li><strong>直購價：</strong>${this.formatNumber(base.d_price)}</li>
                    </ul>
                </dd>
            </dl>

                </div>
            </div>

            <div className="grid-info">
                <div className="wrap">
                <h3 className="h3">配備</h3>
                <ul className="accessory list-inline">
                    {
                        equips.map(function (item, i) {
                            if (item == '天窗') {
                                return
                                <li className="active">天窗</li>;
                            } else {
                                return <li>{item}</li>;
                            }
                        })
                    }
                </ul>
                </div>
            </div>

            <div className="grid-info">
                <div className="wrap">
                <h2 className="h1">購買須知</h2>
                <ul className="notice list-unstyled">
                    <li><em>配備說明</em>{base.memo}</li>
                    <li><em>車　　況</em>{base.descri}</li>
                    <li><em>備　　註</em>{base.memo1}</li>
                    <li><em>注意事項</em>1. 請於完款後三天內至監理站為過戶登記，相關費用需自行承擔。2. 若需托運，其運費依規定辦理。</li>
                </ul>
                </div>
            </div>
        </div>);
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
