using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System.Linq;
using ProcCore.HandleResult;
using GooglereCAPTCHa.Models;
using DotWeb.CommSetup;
using System;

namespace DotWeb.Controllers
{
    public class FAQController : WebUserController
    {
        public ActionResult Index(int? category_id)
        {
            ajax_GetSidebar();
            List<m_Faq> items = new List<m_Faq>();
            FaqCategory get_category = null;
            using (var db0 = getDB0())
            {
                #region get content
                bool Exist = db0.FaqCategory.Any(x => x.faq_category_id == category_id && !x.i_Hide);
                if (category_id == null || !Exist)
                {
                    get_category = db0.FaqCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort).FirstOrDefault();
                    category_id = get_category.faq_category_id;
                    ViewBag.category_name = get_category.category_name;
                }
                else {
                    get_category = db0.FaqCategory.Find(category_id);
                    ViewBag.category_name = get_category.category_name;
                }

                items = db0.Faq.Where(x => !x.i_Hide & x.faq_category_id == category_id).OrderByDescending(x => new { x.sort, x.faq_id })
                               .Select(x => new m_Faq()
                               {
                                   faq_id = x.faq_id,
                                   faq_category_id = x.faq_category_id,
                                   category_name = x.FaqCategory.category_name,
                                   faq_title = x.faq_title,
                                   faq_content = x.faq_content
                               }).ToList();
                ViewBag.category_id = category_id;
                #endregion
            }
            return View("FAQ", items);
        }
        public ActionResult Form()
        {
            ajax_GetSidebar();
            return View("FAQ_Form");
        }
        public void ajax_GetSidebar()
        {
            List<m_FaqCategory> category = new List<m_FaqCategory>();
            using (var db0 = getDB0())
            {
                #region get category 
                category = db0.FaqCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort)
                                         .Select(x => new m_FaqCategory()
                                         {
                                             faq_category_id = x.faq_category_id,
                                             category_name = x.category_name
                                         }).ToList();
                #endregion
            }
            ViewBag.Sidebar = category;
        }
        [HttpPost]
        public string sendMail(FaqMailContent md)
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
                    string Body = getMailBody("FAQEmail", md);//套用信件版面
                    Boolean mail;
                    string mailfrom = md.name + ":" + "system@sym.com";

                    mail = Mail_Send(mailfrom, //寄信人
                                    openLogic().getReceiveMails(), //收信人
                                    CommWebSetup.MailTitle_FAQ, //信件標題
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
    public class BasicMailContent
    {
        public string name { get; set; }//姓名
        public bool sex { get; set; }//性別 男:true,女:false
        public string email { get; set; }//email
        public string tel { get; set; }//電話
        public string response { get; set; }//google 驗證碼
    }
    public class FaqMailContent : BasicMailContent
    {
        public string car_class { get; set; }//愛車車款
        public string license_plate_number { get; set; }//車牌號碼
        public string services { get; set; }// 營業所/服務廠
        public List<int> problem_class { get; set; }//問題種類
        public string content { get; set; }// 提問內容
    }
}
