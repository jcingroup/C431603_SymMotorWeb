using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Linq;

namespace DotWeb.Controllers
{
    public class BuyCarController : WebUserController
    {
        public ActionResult Index()
        {
            ajax_GetEditorSidebar((int)EditorState.BuyCar);
            return View("BuyCar_Index");
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
