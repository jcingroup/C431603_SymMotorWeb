using DotWeb.CommSetup;
using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.IO;
using System.Web.Mvc;
using System.Linq;

namespace DotWeb.Areas.Active.Controllers
{
    public class BrandDataController : AdminController
    {
        #region Action and function section
        public ActionResult Main()
        {
            ActionRun();
            return View();
        }
        public ActionResult Category()
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
                    data = db0.BrandCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort).ToList()
                });
            }
        }
        #endregion


        #region ajax file section
        [HttpPost]
        public string aj_FUpload(string id, string filekind, string fileName)
        {
            UpFileInfo r = new UpFileInfo();
            #region
            string tpl_File = string.Empty;
            try
            {
                //banner
                if (filekind == "Banner")
                    handleImageSave(fileName, id, ImageFileUpParm.BrandRotator, filekind, "Active", "BrandData");
                //album
                if (filekind == "Album")
                    handleImageSave(fileName, id, ImageFileUpParm.BrandRotator, filekind, "Active", "Album");
                if (filekind == "AlbumList")
                    handleImageSave(fileName, id, ImageFileUpParm.BrandRotator, filekind, "Active", "AlbumList");


                r.result = true;
                r.file_name = fileName;
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
            if (filekind == "Banner")
            {
                r.files = listImgFiles(id, filekind, "Active", "BrandData");
            }
            else if (filekind == "AlbumList")
            {
                r.files = listImgFiles(id, filekind, "Active", "AlbumList");
            }
            else {
                r.files = listImgFiles(id, filekind, "Active", "Album");
            }

            r.result = true;
            return defJSON(r);
        }

        [HttpPost]
        public string aj_FDelete(string id, string filekind, string filename)
        {
            ResultInfo r = new ResultInfo();
            if (filekind == "Banner")
            {
                DeleteSysFile(id, filekind, filename, ImageFileUpParm.NewsBasicSingle, "Active", "BrandData");
            }
            else if (filekind == "AlbumList") {
                DeleteSysFile(id, filekind, filename, ImageFileUpParm.NewsBasicSingle, "Active", "AlbumList");
            }
            else {
                DeleteSysFile(id, filekind, filename, ImageFileUpParm.NewsBasicSingle, "Active", "Album");
            }
            r.result = true;
            return defJSON(r);
        }
        #endregion
    }
}