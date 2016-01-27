using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class EventsController : WebUserController
    {
        public ActionResult List()
        {
            return View("Events_list");
        }
        public ActionResult Content()
        {
            return View("Events_content");
        }
    }
}
