using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class NewsController : WebUserController
    {
        public ActionResult List()
        {
            return View("News_list");
        }

        public ActionResult Content()
        {
            return View("News_content");
        }

    }
}
