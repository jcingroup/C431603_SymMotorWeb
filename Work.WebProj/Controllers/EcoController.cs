using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class EcoController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Eco");
        }

    }
}
