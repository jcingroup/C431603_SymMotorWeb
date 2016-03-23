var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');

var ListCars = React.createClass({
    getInitialState: function () {

        var now = new Date();
        var opt_year = [];
        for(var i=0; i < 5; i++ ) {
            opt_year.push(now.getFullYear()-i);
        }

        return {
            lists:[],
            search:{
                h_obj_brand:null,
                h_obj_type:null,
                h_obj_color:null,
                h_obj_born_date:null,
                h_place_dept_no:null,
                h_list_price:null
            },
            options_brand:[],
            options_modal:[],
            options_year:opt_year,
            options_place:[]
        };
    },
    getDefaultProps: function () {
        return {
            sym_web_api:'http://symb2b.sym-motor.com.tw/Wau_New/',
            sym_Web_pic:'http://symb2b.sym-motor.com.tw/wau/pic/'
        };
    },
    componentDidMount: function () {
        $.get(this.props.sym_web_api + 'api.asp',{})
        .done(function(data){
            this.setState({lists:data});
        }.bind(this));

        $.get(this.props.sym_web_api + 'api_brand.asp',{})
        .done(function(data){
            this.setState({options_brand:data});
        }.bind(this));

        $.get(this.props.sym_web_api + 'api_place_dept_no.asp',{})
        .done(function(data){
            this.setState({options_place:data});
        }.bind(this));
    },
    setSearchField:function(n,e){
        var obj = this.state.search;
        var v = e.target.value;
        obj[n]=v;
        this.setState({ search: obj });
    },
    onChangeBrand:function(e){
        var v = e.target.value;
        $.get(this.props.sym_web_api + 'api_modal.asp',{brandno:v})
            .done(function(data){
                var obj = this.state.search;
                obj.h_obj_brand=v;
                this.setState({ search: obj,options_modal:data });
            }.bind(this))
    },
    render:function() {
        let outHtml = null;
        outHtml =
        <div className="wrap">
            <h1 className="h1">{this.props.caption}</h1>
            <section id="content">

                    <h2 className="sr-only">全部中古車一覽表</h2>

                    <section className="grid-search">
                        <h3 className="sr-only">搜尋條件</h3>
                        <form className="form-inline text-sm-center text-xs-left" action="">
                            <div className="form-group">
                                <label htmlFor="brand">廠牌</label> {}
                                <select id="h_obj_brand" className="form-control c-select style2"
                                        value={this.state.search.h_obj_brand}
                                        onChange={this.onChangeBrand}>
                                    <option value="">廠牌</option>
                                    {
                                    this.state.options_brand.map(function(item,i){
                                    return (
                                            <option value={item.value} key={item.value}>{item.name}</option>);
                                    })
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label for="">車型</label> {}
                                <select id="h_obj_type"
                                        value={this.state.search.h_obj_type}
                                        onChange={this.setSearchField.bind(this,'h_obj_type')}
                                        className="form-control c-select style2">
                                    <option value="">車型</option>
                                    {
                                        this.state.options_modal.map(function(item,i){
                                            return (
                                            <option value={item.value} key={item.value}>{item.name}</option>);
                                        })
                                    }
                                </select> {}
                            </div>
                            <div className="form-group">
                                <label for="">車色</label> {}
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
                                </select> {}
                            </div>
                            <div className="form-group">
                                <label for="">年份</label> {}
                                <select id="h_obj_born_date"
                                        value={this.state.search.h_obj_born_date}
                                        className="form-control c-select style2"
                                        onChange={this.setSearchField.bind(this,'h_obj_born_date')}
                                        >
                                    <option value="">年份</option>
                                    {
            this.state.options_year.map(function(item,i){
                return (
                    <option value={item} key={item}>{item}</option>);
            })
                                    }

                                </select> {}
                            </div>
                            <div className="form-group">
                                <label for="">地點</label> {}
                                <select id="h_place_dept_no" 
                                        value={this.state.search.h_place_dept_no}
                                        className="form-control c-select style2">
                                    <option value="">地點</option>
                                    {
                                        this.state.options_place.map(function(item,i){
                                        return (
                                                <option value={item.value} key={item.value}>{item.name}</option>);
                                        })
                                    }
                                </select> {}
                            </div>
                            <div className="form-group">
                                <label for="">價格</label> {}
                                <select name="" id="" className="form-control c-select style2">
                                    <option value="">$0</option>
                                </select> {}
                                <label for="">~</label> {}
                                <select name="" id="" className="form-control c-select style2">
                                    <option value="">不限</option>
                                    <option value="">$1,000,000</option>
                                </select> {}
                            </div>
                            <div className="form-group">
                                <button className="btn btn-secondary">找車</button> {}
                                <button className="btn btn-muted">清除搜尋條件</button> {}
                                <a href="~/UsedCar/Form" className="btn btn-muted gutter-xs-down">填寫更多需求 (協助找車)</a>
                            </div>
                        </form>
                    </section>

                    <section className="grid-products">
                        <h3 className="sr-only">拍賣中的車款</h3>
                        {/* 列表進入點 */}
                        <ol className="card-list row">
                            {
                                    this.state.lists.map(function(item,i){
                                        var outsub_1 = (
                                        <li className="card-wrap" key={item.obj_no}>
                                            <dl className="card">
                                                <dt className="card-img-top">
                                                    <a href={gb_approot+'UsedCar/Content'} title="SEE MORE">
                                                        <img src={this.props.sym_Web_pic + item.obj_no + '_1.jpg'} alt="" />
                                                        <span className="label label-danger">結束時間：{item.end_date} {item.end_time}</span>
                                                    </a>
                                                </dt>
                                                <dd className="card-block">
                                                    <article>
                                                        <h3 className="card-title">
                                                            拍賣編號
                                                            <a href="~/UsedCar/Content">{item.obj_no}</a>
                                                        </h3>
                                                        <div className="card-text">
                                                            <ul className="info list-unstyled">
                                                                <li><em>廠牌:</em> {item.obj_brand}</li>
                                                                <li><em>車型:</em> {item.obj_type}</li>
                                                                <li><em>車色:</em> {item.obj_color} <em>年份:</em> {item.ori_year} <em>地點:</em> {item.dept_cname}</li>
                                                            </ul>
                                                            <p className="price text-danger">直購價<strong>${item.d_price}萬</strong></p>
                                                        </div>
                                                    </article>
                                                </dd>
                                            </dl>
                                        </li>
                                        );
                                        return outsub_1;
                                    }.bind(this))
                            }
                        </ol>

                    </section>

            </section>
        </div>;
        return outHtml;
    }
})

var dom = document.getElementById('carContent');
ReactDOM.render(<ListCars caption={caption} />, dom);
