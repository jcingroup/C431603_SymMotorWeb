using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Collections.Generic;
using System.Linq;

namespace DotWeb.Controllers
{
    public class OfferController : WebUserController
    {
        public ActionResult List()
        {
            ajax_GetEditorSidebar((int)EditorState.BuyCar);
            List<m_Event> items = new List<m_Event>();
            using (var db0 = getDB0())
            {
                #region get content
                items = db0.Event.Where(x => !x.i_Hide & x.event_type == (int)EventType.NewActivity).OrderByDescending(x => x.sort)
                                         .Select(x => new m_Event()
                                         {
                                             event_id = x.event_id,
                                             event_title = x.event_title,
                                             event_info = x.event_info,
                                             show_banner = x.show_banner
                                         }).ToList();
                foreach (var i in items)
                {
                    i.list_imgsrc = GetImg(i.event_id.ToString(), "List", "Active", "EventData", null);
                }
                #endregion
            }
            return View("Offer_list", items);
        }
        public ActionResult Content(int? id)
        {
            ajax_GetEditorSidebar((int)EditorState.BuyCar);
            Event item = new Event();
            using (var db0 = getDB0())
            {
                #region get content
                bool Exist = db0.Event.Any(x => x.event_id == id & !x.i_Hide & x.event_type == (int)EventType.NewActivity);
                if (id == null || !Exist)
                {
                    return Redirect("~/Offer/List");
                }
                else
                {
                    item = db0.Event.Find(id);
                    item.banner_imgsrc = GetImg(item.event_id.ToString(), "Banner", "Active", "EventData", null);
                }
                #endregion
            }
            return View("Offer_content", item);
        }
    }
}
