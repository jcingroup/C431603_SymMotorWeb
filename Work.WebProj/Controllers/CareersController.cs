﻿using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Linq;

namespace DotWeb.Controllers
{
    public class CareersController : WebUserController
    {
        public ActionResult Index()
        {
            EditorDetail item = new EditorDetail();
            using (var db0 = getDB0())
            {
                #region get content
                item = db0.EditorDetail.Where(x => !x.i_Hide & x.editor_id == (int)EditorState.Careers).OrderByDescending(x => x.sort).FirstOrDefault();
                #endregion
            }
            return View("Careers", item);
        }

    }
}
