using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Linq;
using System.Collections.Generic;
using System;

namespace DotWeb.Controllers
{
    public class BuyCarController : WebUserController
    {
        public ActionResult Index()
        {
            checkBrowser();
            ajax_GetEditorSidebar((int)EditorState.BuyCar);
            #region 購車優惠list
            List<m_Event> items = new List<m_Event>();
            using (var db0 = getDB0())
            {
                #region get content
                items = db0.Event.Where(x => !x.i_Hide & x.event_type == (int)EventType.NewActivity).OrderByDescending(x => new { x.sort, x.event_id })
                                         .Select(x => new m_Event()
                                         {
                                             event_id = x.event_id,
                                             event_title = x.event_title,
                                             show_banner = x.show_banner
                                         }).ToList();
                foreach (var i in items)
                {
                    i.list_imgsrc = GetImg(i.event_id.ToString(), "List", "Active", "EventData", null, true);
                    i.banner_imgsrc = GetImg(i.event_id.ToString(), "Banner", "Active", "EventData", null, false);
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
            checkBrowser();
            ajax_GetEditorSidebar((int)EditorState.BuyCar);
            return View("BuyCar_Form");
        }

        [HttpGet]
        public string GetLocation(LocationParm q)
        {
            List<Location> sales = new List<Location>();
            List<Location> repair = new List<Location>();
            using (var db0 = getDB0())
            {
                var temp_s = db0.Location.Where(x => !x.i_Hide & x.is_sales).OrderByDescending(x => x.sort).AsQueryable();
                var temp_r = db0.Location.Where(x => !x.i_Hide & x.is_repair).OrderByDescending(x => x.sort).AsQueryable();

                if (q.city != null)
                {
                    temp_s = temp_s.Where(x => x.city == q.city);
                    temp_r = temp_r.Where(x => x.city == q.city);
                }

                if (q.country != null)
                {
                    temp_s = temp_s.Where(x => x.country == q.country);
                    temp_r = temp_r.Where(x => x.country == q.country);
                }
                sales = temp_s.ToList();
                repair = temp_r.ToList();
            }

            return defJSON(new { sales = sales, repair = repair });
        }
    }
    public class LocationParm
    {
        public string city { get; set; }
        public string country { get; set; }
    }
}
