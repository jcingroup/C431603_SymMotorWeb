﻿using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class BuyCarController : WebUserController
    {
        public ActionResult Index()
        {
            return View("BuyCar_Index");
        }

        public ActionResult Info()
        {
            return View("BuyCar_Info");
        }

        public ActionResult Form()
        {
            return View("BuyCar_Form");
        }

        public ActionResult List()
        {
            return View("BuyCar_list");
        }

        public ActionResult Content()
        {
            return View("BuyCar_content");
        }

    }
}