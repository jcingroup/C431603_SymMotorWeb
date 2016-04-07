var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');

var ListCars = React.createClass({
    getInitialState: function () {

        var now = new Date();
        var opt_year = [];
        for (var i = 1; i <= 5; i++) {
            opt_year.push(now.getFullYear() - i);
        }

        var r = {
            lists: [],
            search: {
                h_obj_brand: null,
                h_obj_type: null,
                h_obj_color: null,
                h_obj_born_date: null,
                h_place_dept_no: null,
                h_list_price: null,
                h_low_price: null
            },
            options_brand: [],
            options_modal: [],
            options_year: opt_year,
            options_place: []
        }

        return r;
    },
    getDefaultProps: function () {

        return {
            sym_web_api: 'http://symb2b.sym-motor.com.tw/Wau_New/',
            sym_Web_pic: 'http://symb2b.sym-motor.com.tw/wau/pic/'
        };
    },
    componentWillMount: function () {

    },
    componentDidMount: function () {
        $.get(this.props.sym_web_api + 'api_index.asp', {}, function (data) {
            this.setState({ lists: data });

            var swiper = new Swiper('#banner', {
                autoplay: 4000,
                autoplayDisableOnInteraction: false,
                loop: true,
                speed: 500
            });

        }.bind(this))

        $.get(this.props.sym_web_api + 'api_brand.asp', {})
        .done(function (data) {
            this.setState({ options_brand: data });
        }.bind(this));

        $.get(this.props.sym_web_api + 'api_place_dept_no.asp', {})
        .done(function (data) {
            this.setState({ options_place: data });
        }.bind(this));

    },
    setSearchField: function (n, e) {
        var obj = this.state.search;
        var v = e.target.value;
        obj[n] = v;
        this.setState({ search: obj });

    },
    onChangeBrand: function (e) {
        var v = e.target.value;
        $.get(this.props.sym_web_api + 'api_modal.asp', { brandno: v })
            .done(function (data) {
                var obj = this.state.search;
                obj.h_obj_brand = v;
                this.setState({ search: obj, options_modal: data });
                //this.onSubmit(e);
            }.bind(this))

    },
    onSubmit: function (e) {
        e.preventDefault();
        //$.get(this.props.sym_web_api + 'api_list.asp', this.state.search)
        //.done(function (data) {
        //    this.setState({ lists: data });
        //}.bind(this));
        console.log(this.state.search);
        var search = this.state.search;
        var q = [];
        for (var n in search) {
            if (search[n] != null) {
                q.push(n + '=' + search[n]);
            }
        }
        console.log(q);
        if (q.length > 0) {
            document.location.href = '/UsedCar/List?' + q.join('&');
        }
        return;
    },
    clearSearch: function (e) {
        var obj = this.state.search;
        obj = {
            h_obj_brand: '',
            h_obj_type: '',
            h_obj_color: '',
            h_obj_born_date: '',
            h_place_dept_no: '',
            h_list_price: '',
            h_low_price: ''
        };
        this.setState({ search: obj });
    },
    render: function () {

        let outHtml = null;
        outHtml =
        (
        <div>
    <h2 className="sr-only">@ViewBag.Title 歡迎頁</h2>

    <div className="grid-search">
        <div className="wrap">

            <section className="featured">
                <h3 className="sr-only">推薦好車</h3>
                <div id="banner" className="swiper-container">
                    <ul className="swiper-wrapper list-unstyled">
                        {
                            this.state.lists.map(function (item, i) {
                                return (
                                <li className="swiper-slide">
                                            <figure>
                                                <a className="thumb" href="/UsedCar/Content"><img src={'http://symb2b.sym-motor.com.tw/wau/hot_pic/' + item.OBJ_PHOTO} alt="" /></a>
                                                <figcaption>
                                                    <ul className="info list-unstyled">
                                                        <li><em>車型</em>{item.OBJ_TYPE}</li>
                                                        <li><em>價格</em><strong>${item.OBJ_PRICE}</strong></li>
                                                        <li><em>年份</em>{item.OBJ_YEAR}</li>
                                                    </ul>
                                                    <p className="detail">{item.OBJ_MEMO}</p>
                                                    {/*<a href={'/UsedCar/Content'} className="more"><i className="ti-angle-double-right"></i> 看詳細介紹</a>*/}
                                                </figcaption>
                                            </figure>
                                </li>
                                    );
                            })
                        }
                    </ul>
                </div>
            </section>

            <div className="search">
                <h3 className="h1">我要找車</h3>
                <form className="form" onSubmit={this.onSubmit}>
                    <div className="form-group row">
                        <label for="" className="sr-only">廠牌</label>
                        <div className="col-xs-7">
                           <select id="h_obj_brand" className="form-control c-select style2"
                                   value={this.state.search.h_obj_brand}
                                   onChange={this.onChangeBrand}>
                                    <option value="">廠牌</option>
                               {
                                                                this.state.options_brand.map(function (item, i) {
                                                                    return (
                                                <option value={item.value} key={item.value}>{item.name}</option>);
                                                                })
                               }
                           </select>

                        </div>
                        <label for="" className="sr-only">車型</label>
                        <div className="col-xs-5">
                                <select id="h_obj_type"
                                        value={this.state.search.h_obj_type}
                                        onChange={this.setSearchField.bind(this,'h_obj_type')}
                                        className="form-control c-select style2">
                                    <option value="">車型</option>
                                    {
                                    this.state.options_modal.map(function (item, i) {
                                        return (
                                            <option value={item.value} key={item.value}>{item.name}</option>);
                                    })
                                    }
                                </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label for="" className="sr-only">車色</label>
                        <div className="col-sm-4 col-xs-5">
                                <select id="h_obj_color"
                                        value={this.state.search.h_obj_color}
                                        className="form-control c-select style2"
                                        onChange={this.setSearchField.bind(this,'h_obj_color')}>
                                    <option value="">車色</option>
                                    <option value='黑'>黑</option>
                                    <option value='白'>白</option>
                                    <option value='紅'>紅</option>
                                    <option value='橙'>橙</option>
                                    <option value='黃'>黃</option>
                                    <option value='綠'>綠</option>
                                    <option value='藍'>藍</option>
                                    <option value='靛'>靛</option>
                                    <option value='紫'>紫</option>
                                    <option value='金'>金</option>
                                    <option value='銀'>銀</option>
                                    <option value='灰'>灰</option>
                                    <option value='棕'>棕</option>
                                    <option value='粉紅'>粉紅</option>
                                    <option value='咖啡'>咖啡</option>
                                </select>
                        </div>
                        <label for="" className="sr-only">年份</label>
                        <div className="col-sm-4 col-xs-7">
                                <select id="h_obj_born_date"
                                        value={this.state.search.h_obj_born_date}
                                        className="form-control c-select style2"
                                        onChange={this.setSearchField.bind(this,'h_obj_born_date')}>
                                    <option value="">年份</option>
                                    {
                                    this.state.options_year.map(function (item, i) {
                                        return (
                                                <option value={item} key={item}>{item}</option>);
                                    })
                                    }

                                </select>
                        </div>
                        <label for="" className="sr-only">地點</label>
                        <div className="col-sm-4 col-xs-12 gutter-xs-down">
                                <select id="h_place_dept_no"
                                        value={this.state.search.h_place_dept_no}
                                        onChange={this.setSearchField.bind(this,'h_place_dept_no')}
                                        className="form-control c-select style2">
                                    <option value="">地點</option>
                                    {
                                    this.state.options_place.map(function (item, i) {
                                        return (
                                                <option value={item.value} key={item.value}>{item.name}</option>);
                                    })
                                    }
                                </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label for="" className="sr-only">價格</label>
                        <div className="col-xs-5">
                                <select value={this.state.search.h_low_price}
                                        onChange={this.setSearchField.bind(this,'h_low_price')}
                                        className="form-control c-select style2">
                                    <option value="">$0</option>
                                </select>
                        </div>
                        <label for="" className="col-xs-2 form-control-label text-xs-center">~</label>
                        <div className="col-xs-5">
                                <select value={this.state.search.h_list_price}
                                        onChange={this.setSearchField.bind(this,'h_list_price')}
                                        className="form-control c-select style2">
                                    <option value="">不限</option>
                                    <option value="">$1,000,000</option>
                                </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-secondary" type="submit">找車</button>
                        <a href="/UsedCar/Form" className="btn btn-secondary">填寫更多需求 (協助找車)</a>
                        <a href="/UsedCar/List" className="btn btn-block btn-danger gutter-sm-down gutter-lg-up">看全部中古車</a>
                    </div>
                </form>
            </div>

        </div>
    </div>

    <div className="grid-quality">
        <div className="wrap">
            <aside className="quality">
                <h3 className="sr-only">原廠三大保證 &amp; 延長保固</h3>
                <ul className="list-unstyled">
                    <li><a className="scroll" href="#article1">車輛三大保證</a></li>
                    <li><a className="scroll" href="#article2">車輛延長保固</a></li>
                </ul>
            </aside>
            <article className="detail">
                <h3 className="sr-only">購車說明</h3>
                <ul className="list-unstyled row">
                    <li><a className="scroll" href="#article3">事故認定及責任</a></li>
                    <li><a className="scroll" href="#article4">相關表格下載</a></li>
                    <li><a className="scroll" href="#article5">競拍流程說明</a></li>
                </ul>
            </article>
        </div>
    </div>

    <div className="grid-info">
        <div className="wrap">

            <article id="article1" className="article">
                <h3 className="h1">車輛三大保證</h3>
                <div className="editor">
                    <h2 className="colored">本活動所競標之車輛保證：</h2>
                    <ul className="list-underline list-icon">
                        <li><strong>非泡水車：</strong>保證車內無入水至座椅，且引擎室未泡過水。</li>
                        <li><strong>非 贓 車：</strong>保證車身號碼或引擎號碼皆未經過變造。</li>
                        <li><strong>無重大事故：</strong>保證無重大事故或車體銜接。</li>
                    </ul>
                </div>
            </article>

        </div>
    </div>

    <div className="grid-info">
        <div className="wrap">

            <article id="article2" className="article">
                <h3 className="h1">車輛延長保固</h3>
                <div className="editor">
                    <h2 className="colored">順益汽車中古車安心保固契約要點</h2>
                    <h3 className="colored">A級車保證範圍</h3>
                    <p>自順益中古車重新領牌日起，半年或5仟公里內，若發生任何機件品質上的問題，則工資、零件一律7折優惠。(日常保養零件及電瓶、雨刷、煞車來令片、輪胎、火星塞、皮帶等消耗性零件則不在此範圍內)。</p>
                    <h3 className="colored">三大系統保固範圍</h3>
                    <ol className="list-underline">
                        <li>在本契約約定之保固期間或里程內，如您的愛車發生機械故障，經本公司認定為本契約提供之保固範圍者，本公司將負責為您的愛車辦理免費檢修或免費修復。（本契約提供之保固範圍包括：(1)引擎本體機件(2)變速箱本體(3)方向機本體）。</li>
                        <li>本契約約定保固期間之起算日為：新車領牌日起5年以下之車輛，自新車保固屆滿日起，提供一年或2萬公里三大系統之保固。(視何者先屆滿時終止)。</li>
                    </ol>
                    <h3 className="colored">安心保固除外事項</h3>
                    <ol className="list-underline">
                        <li>於保固期間未到指定服務廠(限安心保固卡所載)實施定期保養者，或未依約定之保養週期進行保養者。</li>
                        <li>非保固範圍項目：任何因天災、意外、使用疏忽、使用不當、肇事車禍、外物撞擊、賽車或不可抗力及非經原廠進行之改裝等原因所致之損壞或故障。</li>
                        <li>本保固僅提供『引擎本體』、『變速箱本體』、『方向機本體』等零件之保固，不含正常消耗性零件如火星塞、離合器片、傳動軸防塵套等，及引擎/變速箱之電系部品等。</li>
                        <li>因機械故障而衍生之費用，如道路救援費用、交通罰鍰、營業損失或其他附帶損失等。</li>
                    </ol>
                    <p>『順益優質中古車』除了提供客戶三大保證(非泡水車/非贓車/無重大事故)外，另外保固期間方面也從原先的『半年或五仟公里』延長至『一年或2萬公里』。</p>
                    <p>「品質保證，信用實在」一直是順益汽車對客戶服務的堅持，提供客戶嚴選的中古車、原廠的專業技術、便利的服務，也是順益汽車對每一位客戶不變的承諾。</p>
                </div>
            </article>

        </div>
    </div>

    <div className="grid-info">
        <div className="wrap">

            <article id="article3" className="article">
                <h3 className="h1">事故認定及責任</h3>
                <div className="editor">
                    <h3 className="colored">事故車判定基準</h3>
                    <ol className="list-underline">
                        <li><strong>車頭部份：</strong>凡維修範圍為前避震器座之內者，及前大樑變形需校正、整修或更換判定之。</li>
                        <li><strong>車尾部份：</strong>凡維修範圍為後尾板（含）之內者，只要更換過，判定之。</li>
                        <li><strong>車身底盤部份：</strong>所有車身結構，只要更換過或整修過，判定之。</li>
                        <li><strong>車側部份：</strong>凡Ａ、Ｂ、Ｃ柱及兩側戶定有更換過或整修過，判定之。</li>
                        <li><strong>車頂部份：</strong>更換過車頂時，判定之。</li>
                        <li><strong>排外條款：</strong>車身門皮或葉子板，有更換過或維修過；車頂鈑噴過，不列入事故車之範圍。</li>
                    </ol>
                    <p>『順益優質中古車』除了提供客戶三大保證(非泡水車/非贓車/無重大事故)外，另外保固期間方面也從原先的『半年或五仟公里』延長至『一年或2萬公里』。</p>
                    <p>「品質保證，信用實在」一直是順益汽車對客戶服務的堅持，提供客戶嚴選的中古車、原廠的專業技術、便利的服務，也是順益汽車對每一位客戶不變的承諾。</p>
                    <h3 className="colored">大事故基準規範說明</h3>
                    <ol className="list-underline">
                        <li>左、右側A、B、Ｃ柱位置，有切割之維修現象，或者更換校正作業現象。</li>
                        <li>F1與R1；R2與L2(左右側A、B、C柱)兩條基準線交集之內部範圍(#字型範圍)，因撞擊事故波及導致之最終受損處，已產生龜裂、變形或者有鎚打、切割、焊接及更換校正作業。</li>
                        <li>前後大樑位置，有切割、校正、龜裂、鎚打、焊接之維修痕跡。</li>
                    </ol>
                </div>
            </article>

        </div>
    </div>

    <div className="grid-info">
        <div className="wrap">

            <article id="article4" className="article">
                <h3 className="h1">相關表格下載</h3>
                <div className="editor">
                    <ul className="list-underline list-icon">
                        <li><a href="http://symb2b.sym-motor.com.tw/%E6%8E%88%E4%BF%A1%E9%83%A8/%E4%B8%AD%E5%8F%A4%E8%BB%8A%E7%B5%84/%E7%B6%B2%E9%A0%81/%E6%AA%94%E6%A1%88/%E6%8B%8D%E8%B3%A3%E5%A7%94%E8%A8%97%E6%9B%B8.pdf" target="new">客戶(來賓)拍賣委託書</a></li>
                        <li><a href="http://symb2b.sym-motor.com.tw/%E6%8E%88%E4%BF%A1%E9%83%A8/%E4%B8%AD%E5%8F%A4%E8%BB%8A%E7%B5%84/%E7%B6%B2%E9%A0%81/%E6%AA%94%E6%A1%88/%E6%B1%BD%E8%BB%8A%E8%B2%B7%E8%B3%A3%E5%90%88%E7%B4%84%E6%9B%B8.pdf" target="new">汽車買賣契約書</a></li>
                        <li><a href="http://symb2b.sym-motor.com.tw/%E6%8E%88%E4%BF%A1%E9%83%A8/%E4%B8%AD%E5%8F%A4%E8%BB%8A%E7%B5%84/%E7%B6%B2%E9%A0%81/%E6%AA%94%E6%A1%88/%E7%B6%B2%E6%8B%8D%E8%BB%8A%E5%8C%AF%E6%AC%BE%E5%B8%B3%E8%99%9F.pdf" target="new">網拍車匯款帳號</a></li>
                        <li><a href="http://symb2b.sym-motor.com.tw/%E6%8E%88%E4%BF%A1%E9%83%A8/%E4%B8%AD%E5%8F%A4%E8%BB%8A%E7%B5%84/%E7%B6%B2%E9%A0%81/%E6%AA%94%E6%A1%88/%E4%B8%AD%E5%8F%A4%E8%BB%8A%E8%BD%89%E8%AA%BF%E5%96%AE.pdf" target="new">車輛轉調申請書</a></li>
                        <li><a href="http://symb2b.sym-motor.com.tw/%E6%8E%88%E4%BF%A1%E9%83%A8/%E4%B8%AD%E5%8F%A4%E8%BB%8A%E7%B5%84/%E7%B6%B2%E9%A0%81/%E6%AA%94%E6%A1%88/%E5%AE%A2%E6%88%B6%E8%B3%87%E6%96%99%E5%9B%9E%E9%A5%8B%E8%A1%A8.pdf" target="new">客戶資料回饋表</a></li>
                        <li><a href="http://symb2b.sym-motor.com.tw/%E6%8E%88%E4%BF%A1%E9%83%A8/%E4%B8%AD%E5%8F%A4%E8%BB%8A%E7%B5%84/%E7%B6%B2%E9%A0%81/%E6%AA%94%E6%A1%88/%E9%A0%86%E7%9B%8A%E6%B1%BD%E8%BB%8A%E7%B6%B2%E6%8B%8D%E8%BB%8A%E8%AA%BF%E6%9F%A5%E8%A1%A8.pdf" target="new">網拍車車況調查表</a></li>
                    </ul>
                </div>
            </article>

        </div>
    </div>

    <div className="grid-info">
        <div className="wrap">

            <article id="article5" className="article">
                <h3 className="h1">競拍流程說明</h3>
                <div className="editor">
                    <p>請至 <a href="http://symb2b.sym-motor.com.tw/" target="new">順益汽車優質網拍車</a> 網站，方可參與競標唷！</p>
                </div>
            </article>

        </div>
    </div>
        </div>
        );
        return outHtml;

    }
})

var dom = document.getElementById('content');
ReactDOM.render(<ListCars caption={caption } />, dom);
