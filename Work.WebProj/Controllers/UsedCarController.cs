using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class UsedCarController : WebUserController
    {
        public ActionResult Index()
        {
            return View("UsedCar_Index");
        }

        public ActionResult List()
        {
            return View("UsedCar_list");
        }

        public ActionResult Content()
        {
            return View("UsedCar_content");
        }

        public ActionResult Info()
        {
            return View("UsedCar_Info");
        }

    }
}
