using DotWeb.CommSetup;
using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.IO;
using System.Web.Mvc;
using System.Linq;

namespace DotWeb.Areas.Active.Controllers
{
    public class EditorController : AdminController
    {
        #region Action and function section
        public ActionResult Main()
        {
            ActionRun();
            return View();
        }
        public ActionResult AboutUs()
        {
            ActionRun();
            return View();
        }
        public ActionResult Enterprise()
        {
            ActionRun();
            return View();
        }
        public ActionResult Careers()
        {
            ActionRun();
            return View();
        }
        public ActionResult BuyCar()
        {
            ActionRun();
            return View();
        }
        public ActionResult Repair()
        {
            ActionRun();
            return View();
        }
        public ActionResult Loan()
        {
            ActionRun();
            return View();
        }
        public ActionResult Insurance()
        {
            ActionRun();
            return View();
        }
        public ActionResult Accessory()
        {
            ActionRun();
            return View();
        }
        public ActionResult Eco()
        {
            ActionRun();
            return View();
        }
        #endregion

        #region ajax call section
        public string aj_Init()
        {
            using (var db0 = getDB0())
            {
                return defJSON(new
                {
                    data = db0.FaqCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort).ToList()
                });
            }
        }
        #endregion
    }
}