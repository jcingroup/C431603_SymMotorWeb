using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Collections.Generic;
using System.Linq;
using ProcCore.HandleResult;
using GooglereCAPTCHa.Models;
using System;
using DotWeb.CommSetup;

namespace DotWeb.Controllers
{
    public class TestDriveController : WebUserController
    {
        public ActionResult Index()
        {
            return View("TestDrive");
        }
        [HttpGet]
        public string GetInitData()
        {
            List<L1> brands = new List<L1>();
            List<GroupOption> locations = new List<GroupOption>();
            using (var db0 = getDB0())
            {
                var temp_b = db0.BrandCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort)
                                .Select(x => new L1()
                                {
                                    l1_id = x.brand_category_id,
                                    l1_name = x.category_name,
                                    l2_list = x.Brand.Where(y => !y.i_Hide).OrderBy(y => y.sort).Select(y => new L2() { l2_id = y.brand_id, l2_name = y.brand_name }).ToList()
                                });
                var temp_l = db0.Location.Where(x => !x.i_Hide & x.is_sales).OrderByDescending(x => x.sort)
                                        .GroupBy(x => x.city).Select(x => new GroupOption()
                                        {
                                            key = x.Key,
                                            locations = x.Select(y => new m_Location()
                                            {
                                                location_id = y.location_id,
                                                location_name = y.location_name,
                                                city = y.city,
                                                country = y.country,
                                                address = y.address,
                                                east_coordinate = y.east_coordinate,
                                                north_coordinate = y.north_coordinate
                                            }).ToList()
                                        });


                brands = temp_b.ToList();
                locations = temp_l.ToList();
            }

            return defJSON(new { brands = brands, locations = locations });
        }
        [HttpPost]
        public string sendMail(TestDriveMailContent md)
        {
            ResultInfo r = new ResultInfo();
            #region 驗證碼
            ValidateResponse Validate = ValidateCaptcha(md.response);
            if (!Validate.Success)
            {
                r.result = false;
                r.message = Resources.Res.Log_Err_googleValideNotEquel;
                return defJSON(r);
            }
            #endregion
            try
            {
                using (db0 = getDB0())
                {
                    if (md.email == null)
                    {
                        r.result = false;
                        r.message = Resources.Res.Log_Err_MailAddressBlank;
                        return defJSON(r);
                    }
                    if (md.type == (int)EmailState.TestDrive)
                    {
                        ResultInfo info = addTestDrive(md);
                        if (!info.result)
                        {
                            r.result = false;
                            r.message = info.message;
                            return defJSON(r);
                        }
                    }
                    #region 信件發送
                    string Body = getMailBody("TestDriveEmail", md);//套用信件版面
                    Boolean mail;
                    string mailfrom = md.name + ":" + md.email;
                    string title = string.Empty;
                    if (md.type == 2) { title = CommWebSetup.MailTitle_TestDrive; } else { title = CommWebSetup.MailTitle_BuyCar; }
                    mail = Mail_Send(mailfrom, //寄信人
                                    openLogic().getReceiveMails(), //收信人
                                    title, //信件標題
                                    Body, //信件內容
                                    true); //是否為html格式
                    if (mail == false)
                    {
                        r.result = false;
                        r.message = Resources.Res.Log_Err_SendMailFail;
                        return defJSON(r);
                    }
                    #endregion
                }
                r.result = true;
                r.message = Resources.Res.Log_Success_SendMail;
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return defJSON(r);
        }
    }
    public class TestDriveMailContent : BasicMailContent
    {
        public int type { get; set; }//分 試乘:2 賞車:4
        public int car_models { get; set; }//試乘車款 賞車車款
        public string car_models_name { get; set; }
        public string contact_time { get; set; }//聯繫時間
        //看車時間
        public int view_year { get; set; }//年
        public int view_month { get; set; }//月
        public int view_day { get; set; }//日
        public string view_time { get; set; }//時
        //看車地點
        public string view_city { get; set; }//縣市
        public int view_location { get; set; }//營業點
        public string view_location_name { get; set; }
        //checkbo
        public bool is_edm { get; set; }
        public bool is_agree { get; set; }
    }
}
