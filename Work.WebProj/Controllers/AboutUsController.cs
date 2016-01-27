using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class AboutUsController : WebUserController
    {
        public ActionResult Index()
        {
            return View("AboutUs");
        }
    }
}
