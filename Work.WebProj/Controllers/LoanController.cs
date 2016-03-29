using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Linq;
using DotWeb.CommSetup;
using System;
using GooglereCAPTCHa.Models;
using ProcCore.HandleResult;

namespace DotWeb.Controllers
{
    public class LoanController : WebUserController
    {
        public ActionResult Index(int? id)
        {
            ajax_GetEditorSidebar((int)EditorState.Loan);
            EditorDetail item = new EditorDetail();
            using (var db0 = getDB0())
            {
                #region get content
                bool Exist = db0.EditorDetail.Any(x => x.editor_detail_id == id & !x.i_Hide & x.editor_id == (int)EditorState.Loan);
                if (id == null || !Exist)
                {
                    item = db0.EditorDetail.Where(x => !x.i_Hide & x.editor_id == (int)EditorState.Loan).OrderByDescending(x => x.sort).FirstOrDefault();
                    id = item.editor_detail_id;
                }
                else {
                    item = db0.EditorDetail.Find(id);
                }
                #endregion
            }
            ViewBag.detail_id = id;
            return View("Loan", item);
        }
        public ActionResult Form()
        {
            checkBrowser();
            ajax_GetEditorSidebar((int)EditorState.Loan);
            return View("Loan_Form");
        }
        [HttpPost]
        public string sendMail(LoanMailContent md)
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
                    string Body = getMailBody("LoanEmail", md);//套用信件版面
                    Boolean mail;
                    string mailfrom = md.name + ":" + md.email;

                    mail = Mail_Send(mailfrom, //寄信人
                                    openLogic().getReceiveMails(), //收信人
                                    CommWebSetup.MailTitle_Loan, //信件標題
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
    public class LoanMailContent : BasicMailContent
    {
        //loan
        public string loan_project { get; set; }//選擇申貸項目
        //new
        public string car_models { get; set; }//購買車型
        public float car_price { get; set; }//車輛牌價
        public float down_payment { get; set; }//頭款
        public float loan_price { get; set; }//貸款金額
        public float installments { get; set; }//分期付款 期繳
        public float rate { get; set; }//利率
        public float monthly_payment { get; set; }//月付款
        //used
        public string license_plate_number { get; set; }//車牌號碼
        public string car_brand { get; set; }//車輛廠牌
        public int car_year { get; set; }//出廠年份
        public int car_month { get; set; }//出場月份
    }
}
