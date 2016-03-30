using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Collections.Generic;
using System.Linq;

namespace DotWeb.Controllers
{
    public class NewsController : WebUserController
    {
        public ActionResult List()
        {
            List<m_News> items = new List<m_News>();
            using (var db0 = getDB0())
            {
                #region get content
                items = db0.News.Where(x => !x.i_Hide).OrderByDescending(x => new { x.sort, x.day, x.news_id })
                                         .Select(x => new m_News()
                                         {
                                             news_id = x.news_id,
                                             news_title = x.news_title,
                                             news_info = x.news_info,
                                             day = x.day
                                         }).ToList();
                foreach (var i in items)
                {
                    i.imgsrc = GetImg(i.news_id.ToString(), "List", "Active", "News", null, true);
                }
                #endregion
            }
            return View("News_list", items);
        }

        public ActionResult Content(int? id)
        {
            News item = new News();
            using (var db0 = getDB0())
            {
                #region get content
                bool Exist = db0.News.Any(x => x.news_id == id && !x.i_Hide);
                if (id == null || !Exist)
                {
                    return Redirect("~/News/List");
                }
                else
                {
                    item = db0.News.Find(id);
                }
                #endregion
            }
            return View("News_content", item);
        }

    }
}
