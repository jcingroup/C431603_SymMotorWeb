using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System.Linq;

namespace DotWeb.Controllers
{
    public class IndexController : WebUserController
    {
        public ActionResult Index()
        {
            IndexInfo info = new IndexInfo();
            using (var db0 = getDB0())
            {
                #region banner
                info.banners = db0.Banner.Where(x => !x.i_Hide).OrderByDescending(x => x.sort)
                                         .Select(x => new m_Banner()
                                         {
                                             banner_id = x.banner_id,
                                             banner_name = x.banner_name
                                         }).ToList();
                foreach (var i in info.banners)
                {
                    i.imgsrc = GetImg(i.banner_id.ToString(), "Banner", "Active", "BannerData", null);
                }
                #endregion
                #region news
                info.news = db0.News.Where(x => !x.i_Hide).OrderByDescending(x => x.sort)
                                         .Select(x => new m_News()
                                         {
                                             news_id = x.news_id,
                                             day = x.day,
                                             news_title = x.news_title,
                                             news_info = x.news_info
                                         }).Take(3).ToList();
                #endregion
            }
            return View("Index", info);
        }
        public RedirectResult Login()
        {
            return Redirect("~/Base/Login");
        }
    }
    public class IndexInfo
    {
        public List<m_Banner> banners { get; set; }
        public List<m_News> news { get; set; }
    }
}
