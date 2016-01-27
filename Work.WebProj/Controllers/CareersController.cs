using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class CareersController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Careers");
        }

    }
}
