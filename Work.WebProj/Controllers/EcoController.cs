﻿using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Linq;

namespace DotWeb.Controllers
{
    public class EcoController : WebUserController
    {
        public ActionResult Index(int? id)
        {
            ajax_GetEditorSidebar((int)EditorState.Eco);
            EditorDetail item = new EditorDetail();
            using (var db0 = getDB0())
            {
                #region get content
                bool Exist = db0.EditorDetail.Any(x => x.editor_detail_id == id & !x.i_Hide & x.editor_id == (int)EditorState.Eco);
                if (id == null || !Exist)
                {
                    item = db0.EditorDetail.Where(x => !x.i_Hide & x.editor_id == (int)EditorState.Eco).OrderByDescending(x => x.sort).FirstOrDefault();
                    id = item.editor_detail_id;
                }
                else {
                    item = db0.EditorDetail.Find(id);
                }
                #endregion
            }
            ViewBag.detail_id = id;
            return View("Eco", item);
        }

    }
}
