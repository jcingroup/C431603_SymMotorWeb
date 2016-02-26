using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Linq;
using System.Collections.Generic;

namespace DotWeb.Controllers
{
    public class BuyCarController : WebUserController
    {
        public ActionResult Index()
        {
            ajax_GetEditorSidebar((int)EditorState.BuyCar);
            #region 購車優惠list
            List<m_Event> items = new List<m_Event>();
            using (var db0 = getDB0())
            {
                #region get content
                items = db0.Event.Where(x => !x.i_Hide & x.event_type == (int)EventType.NewActivity).OrderByDescending(x => x.sort)
                                         .Select(x => new m_Event()
                                         {
                                             event_id = x.event_id,
                                             event_title = x.event_title,
                                             show_banner = x.show_banner
                                         }).ToList();
                foreach (var i in items)
                {
                    i.list_imgsrc = GetImg(i.event_id.ToString(), "List", "Active", "EventData", null);
                    i.banner_imgsrc = GetImg(i.event_id.ToString(), "Banner", "Active", "EventData", null);
                }
                #endregion
            }
            #endregion
            return View("BuyCar_Index", items);
        }

        public ActionResult Info(int? id)
        {
            ajax_GetEditorSidebar((int)EditorState.BuyCar);
            EditorDetail item = new EditorDetail();
            using (var db0 = getDB0())
            {
                #region get content
                bool Exist = db0.EditorDetail.Any(x => x.editor_detail_id == id & !x.i_Hide & x.editor_id == (int)EditorState.BuyCar);
                if (id == null || !Exist)
                {
                    item = db0.EditorDetail.Where(x => !x.i_Hide & x.editor_id == (int)EditorState.BuyCar).OrderByDescending(x => x.sort).FirstOrDefault();
                    id = item.editor_detail_id;
                }
                else {
                    item = db0.EditorDetail.Find(id);
                }
                #endregion
            }
            ViewBag.detail_id = id;
            return View("BuyCar_Info", item);
        }

        public ActionResult Form()
        {
            ajax_GetEditorSidebar((int)EditorState.BuyCar);
            return View("BuyCar_Form");
        }
    }
}
