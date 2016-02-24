using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System.Linq;

namespace DotWeb.Controllers
{
    public class FAQController : WebUserController
    {
        public ActionResult Index(int? category_id)
        {
            ajax_GetSidebar();
            List<m_Faq> items = new List<m_Faq>();
            FaqCategory get_category = null;
            using (var db0 = getDB0())
            {
                #region get content
                bool Exist = db0.FaqCategory.Any(x => x.faq_category_id == category_id && !x.i_Hide);
                if (category_id == null || !Exist)
                {
                    get_category = db0.FaqCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort).FirstOrDefault();
                    category_id = get_category.faq_category_id;
                    ViewBag.category_name = get_category.category_name;
                }
                else {
                    get_category = db0.FaqCategory.Find(category_id);
                    ViewBag.category_name = get_category.category_name;
                }

                items = db0.Faq.Where(x => !x.i_Hide & x.faq_category_id == category_id).OrderByDescending(x => x.sort)
                               .Select(x => new m_Faq()
                               {
                                   faq_id = x.faq_id,
                                   faq_category_id = x.faq_category_id,
                                   category_name = x.FaqCategory.category_name,
                                   faq_title = x.faq_title,
                                   faq_content = x.faq_content
                               }).ToList();
                ViewBag.category_id = category_id;
                #endregion
            }
            return View("FAQ", items);
        }
        public ActionResult Form()
        {
            ajax_GetSidebar();
            ViewBag.category_id = 0;
            return View("FAQ_Form");
        }
        public void ajax_GetSidebar()
        {
            List<m_FaqCategory> category = new List<m_FaqCategory>();
            using (var db0 = getDB0())
            {
                #region get category 
                category = db0.FaqCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort)
                                         .Select(x => new m_FaqCategory()
                                         {
                                             faq_category_id = x.faq_category_id,
                                             category_name = x.category_name
                                         }).ToList();
                #endregion
            }
            ViewBag.Sidebar = category;
        }
    }
}
