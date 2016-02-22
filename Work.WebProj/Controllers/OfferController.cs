using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class OfferController : WebUserController
    {
        public ActionResult List()
        {
            return View("Offer_list");
        }
        public ActionResult Content()
        {
            return View("Offer_content");
        }
    }
}
