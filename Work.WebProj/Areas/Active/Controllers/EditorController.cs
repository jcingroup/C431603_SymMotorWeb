using DotWeb.Controller;
using System.Web.Mvc;
using System.Linq;
using ProcCore.Business.DB0;

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
            ViewBag.id = (int)EditorState.AboutUs;
            return View();
        }
        public ActionResult Enterprise()
        {
            ActionRun();
            ViewBag.id = (int)EditorState.Enterprise;
            return View();
        }
        public ActionResult Careers()
        {
            ActionRun();
            ViewBag.id = (int)EditorState.Careers;
            return View();
        }
        public ActionResult BuyCar()
        {
            ActionRun();
            ViewBag.id = (int)EditorState.BuyCar;
            return View();
        }
        public ActionResult Repair()
        {
            ActionRun();
            ViewBag.id = (int)EditorState.Repair;
            return View();
        }
        public ActionResult Loan()
        {
            ActionRun();
            ViewBag.id = (int)EditorState.Loan;
            return View();
        }
        public ActionResult Insurance()
        {
            ActionRun();
            ViewBag.id = (int)EditorState.Insurance;
            return View();
        }
        public ActionResult Accessory()
        {
            ActionRun();
            ViewBag.id = (int)EditorState.Accessory;
            return View();
        }
        public ActionResult Eco()
        {
            ActionRun();
            ViewBag.id = (int)EditorState.Eco;
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