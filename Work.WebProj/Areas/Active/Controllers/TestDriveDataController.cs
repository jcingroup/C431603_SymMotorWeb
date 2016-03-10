using DotWeb.Controller;
using System.Web.Mvc;
using System.Linq;
using ProcCore.Business.DB0;

namespace DotWeb.Areas.Active.Controllers
{
    public class TestDriveDataController : AdminController
    {
        #region Action and function section
        public ActionResult Main()
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
                    //data = db0.FaqCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort).ToList()
                });
            }
        }
        #endregion
    }
}