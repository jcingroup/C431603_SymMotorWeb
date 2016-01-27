using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class RepairController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Repair");
        }

    }
}
