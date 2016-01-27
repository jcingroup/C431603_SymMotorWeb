using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class FAQController : WebUserController
    {
        public ActionResult List()
        {
            return View("FAQ_list");
        }
        public ActionResult Content()
        {
            return View("FAQ_content");
        }
        public ActionResult Form()
        {
            return View("FAQ_Form");
        }
    }
}
