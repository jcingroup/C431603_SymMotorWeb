using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.HandleResult;
using GooglereCAPTCHa.Models;
using DotWeb.CommSetup;
using System;

namespace DotWeb.Controllers
{
    public class UsedCarController : WebUserController
    {
        public ActionResult Index()
        {
            return View("UsedCar_Index");
        }

        public ActionResult List()
        {
            return View("UsedCar_list");
        }

        public ActionResult Content()
        {
            ViewBag.h_auc_no = Request.QueryString["h_auc_no"];
            ViewBag.h_obj_no = Request.QueryString["h_obj_no"];

            return View("UsedCar_content");
        }

        public ActionResult Form()
        {
            return View("UsedCar_Form");
        }
        [HttpPost]
        public string sendMail(UsedCarMailContent md)
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
                    #region 信件發送
                    string Body = getMailBody("UsedCarEmail", md);//套用信件版面
                    Boolean mail;
                    string mailfrom = md.name + ":" + md.email;

                    mail = Mail_Send(mailfrom, //寄信人
                                    openLogic().getReceiveMails(), //收信人
                                    CommWebSetup.MailTitle_UsedCar, //信件標題
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
    public class UsedCarMailContent : BasicMailContent
    {
        public string car_models { get; set; }//車型
        public string car_color { get; set; }//車色
        public string car_year { get; set; }//年分
        public int car_price { get; set; }//價格
        public string content { get; set; }// 提問內容
    }
}
