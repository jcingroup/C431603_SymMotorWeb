using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class InsuranceController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Insurance");
        }

    }
}
