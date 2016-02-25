using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;

namespace DotWeb.Controllers
{
    public class OfferController : WebUserController
    {
        public ActionResult List()
        {
            ajax_GetEditorSidebar((int)EditorState.BuyCar);
            return View("Offer_list");
        }
        public ActionResult Content()
        {
            return View("Offer_content");
        }
    }
}
