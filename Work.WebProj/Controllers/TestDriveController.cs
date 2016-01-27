using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class TestDriveController : WebUserController
    {
        public ActionResult Index()
        {
            return View("TestDrive");
        }

    }
}
