using DotWeb.CommSetup;
using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.IO;
using System.Web.Mvc;
using System.Linq;
using System.Web;

namespace DotWeb.Areas.Active.Controllers
{
    public class EventDataController : AdminController
    {
        #region Action and function section
        public ActionResult Main()
        {
            ActionRun();
            return View();
        }
        public ActionResult Event()
        {
            ActionRun();
            return View();
        }
        public ActionResult Offer()
        {
            ActionRun();
            return View();
        }
        #endregion

        #region ajax call section
        public string aj_Init()
        {
            using (var db0 = getDB0())
            {
                return defJSON(new
                {
                });
            }
        }
        #endregion


        #region ajax file section
        [HttpPost]
        public string aj_FUpload(string id, string filekind, HttpPostedFileBase file)
        {
            UpFileInfo r = new UpFileInfo();
            #region
            string tpl_File = string.Empty;
            try
            {
                //banner
                if (filekind == "Banner")
                    handleImageSave(file, id, ImageFileUpParm.BannerRotator, filekind, "Active", "EventData");
                if (filekind == "List")
                    handleImageSave(file, id, ImageFileUpParm.EventList, filekind, "Active", "EventData");


                r.result = true;
                r.file_name = file.FileName;
            }
            catch (LogicError ex)
            {
                r.result = false;
                r.message = getRecMessage(ex.Message);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            #endregion
            return defJSON(r);
        }

        [HttpPost]
        public string aj_FList(string id, string filekind)
        {
            SerializeFileList r = new SerializeFileList();

            r.files = listImgFiles(id, filekind, "Active", "EventData");
            r.result = true;
            return defJSON(r);
        }

        [HttpPost]
        public string aj_FDelete(string id, string filekind, string filename)
        {
            ResultInfo r = new ResultInfo();
            DeleteSysFile(id, filekind, filename, ImageFileUpParm.NewsBasicSingle, "Active", "EventData");
            r.result = true;
            return defJSON(r);
        }
        #endregion
    }
}