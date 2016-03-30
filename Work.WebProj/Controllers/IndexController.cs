using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System.Linq;
using ProcCore.Business.LogicConect;

namespace DotWeb.Controllers
{
    public class IndexController : WebUserController
    {
        public ActionResult Index()
        {
            Page_Load();//人次計數
            IndexInfo info = new IndexInfo();
            using (var db0 = getDB0())
            {
                #region banner
                info.banners = db0.Banner.Where(x => !x.i_Hide).OrderByDescending(x => new { x.sort, x.banner_id })
                                         .Select(x => new m_Banner()
                                         {
                                             banner_id = x.banner_id,
                                             banner_name = x.banner_name,
                                             banner_url = x.banner_url
                                         }).ToList();
                foreach (var i in info.banners)
                {
                    i.imgsrc = GetImg(i.banner_id.ToString(), "Banner", "Active", "BannerData", null, false);
                }
                #endregion
                #region news
                info.news = db0.News.Where(x => !x.i_Hide).OrderByDescending(x => new { x.sort, x.day, x.news_id })
                                         .Select(x => new m_News()
                                         {
                                             news_id = x.news_id,
                                             day = x.day,
                                             news_title = x.news_title,
                                             news_info = x.news_info
                                         }).Take(2).ToList();
                #endregion
                #region banner
                info.brands = db0.Brand.Where(x => !x.i_Hide).OrderByDescending(x => new { x.sort, x.brand_id })
                                         .Select(x => new m_Brand()
                                         {
                                             brand_category_id = x.brand_category_id,
                                             brand_id = x.brand_id,
                                             category_name = x.BrandCategory.category_name,
                                             brand_name = x.brand_name
                                         }).ToList();
                foreach (var i in info.brands)
                {
                    i.imgsrc = GetImg(i.brand_id.ToString(), "Banner", "Active", "BrandData", null, true);
                }
                #endregion
                #region facebook
                var open = openLogic();
                info.facebook_url = (string)open.getParmValue(ParmDefine.FacebookUrl);
                info.isClickIndex_Count = (int)open.getParmValue(ParmDefine.Count);
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
        public List<m_Brand> brands { get; set; }
        public string facebook_url { get; set; }
        public int isClickIndex_Count { get; set; }
    }
}
