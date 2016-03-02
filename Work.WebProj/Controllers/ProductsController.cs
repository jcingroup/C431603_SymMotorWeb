using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System.Linq;

namespace DotWeb.Controllers
{
    public class ProductsController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Products");
        }
        public ActionResult Album()
        {
            return View("Album");
        }
    }
}
