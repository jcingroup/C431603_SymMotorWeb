using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Linq;

namespace DotWeb.Controllers
{
    public class MapController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Map");
        }
    }
}
