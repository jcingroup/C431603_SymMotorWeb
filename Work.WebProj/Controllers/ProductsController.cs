using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System.Linq;

namespace DotWeb.Controllers
{
    public class ProductsController : WebUserController
    {
        public ActionResult Index(int? id)
        {
            Brand item = new Brand();
            using (var db0 = getDB0())
            {
                #region get content
                bool Exist = db0.Brand.Any(x => x.brand_id == id && !x.i_Hide);
                if (id == null || !Exist)
                {
                    return Redirect("~/Products/NoData");
                }
                else
                {
                    item = db0.Brand.Find(id);
                    item.category_name = item.BrandCategory.category_name;
                    item.imgsrc = GetImg(item.brand_id.ToString(), "Banner", "Active", "BrandData", null, true);
                    item.albums = item.BrandAlbum.ToList();
                    foreach (var i in item.albums)
                    {
                        i.imgsrc = GetImg(i.brand_album_id.ToString(), "Album", "Active", "Album", null, true);
                    }
                }
                #endregion
            }
            return View("Products", item);
        }
        public ActionResult Album(int? id)
        {
            List<BrandAlbumDetail> items = new List<BrandAlbumDetail>();
            using (var db0 = getDB0())
            {
                #region get content
                bool Exist = db0.BrandAlbum.Any(x => x.brand_album_id == id);
                if (id == null || !Exist)
                {
                    return Redirect("~/Products/NoData");
                }
                else
                {
                    items = db0.BrandAlbumDetail.Where(x => x.brand_album_id == id).ToList();
                    foreach (var i in items)
                    {
                        i.imgsrc = GetImg(i.brand_album_detail_id.ToString(), "AlbumList", "Active", "AlbumList", null, false);
                    }
                }
                #endregion
            }
            return View("Album", items);
        }
        public ActionResult NoData()
        {
            return View();
        }
    }
}
