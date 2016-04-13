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
                speed: 500,
                preloadImages: false,
                lazyLoading: true
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
                                                <span className="thumb">
                                                    <img data-src={'http://symb2b.sym-motor.com.tw/wau/hot_pic/' + item.OBJ_PHOTO} alt="" className="swiper-lazy" />
                                                    <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                                </span>
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
        </div>
        );
        return outHtml;

    }
})

var dom = document.getElementById('jsx');
ReactDOM.render(<ListCars caption={caption } />, dom);
