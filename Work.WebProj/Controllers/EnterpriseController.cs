using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class EnterpriseController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Enterprise");
        }

    }
}
