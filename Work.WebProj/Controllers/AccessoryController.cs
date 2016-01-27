using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class AccessoryController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Accessory");
        }
    }
}
