﻿using DotWeb.Helpers;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace DotWeb.Api
{
    public class BrandAlbumController : ajaxApi<BrandAlbum, q_BrandAlbum>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.BrandAlbum.FindAsync(id);
                r = new ResultInfo<BrandAlbum>() { data = item };
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_BrandAlbum q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.BrandAlbum
                    .Where(x => x.brand_id == q.brand_id)
                    .OrderBy(x => x.brand_album_id)
                    .Select(x => new m_BrandAlbum()
                    {
                        brand_album_id = x.brand_album_id,
                        brand_id = x.brand_id,
                        album_name = x.album_name,
                        sort = x.sort
                    });

                return Ok(await items.ToListAsync());
            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]BrandAlbum md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.BrandAlbum.FindAsync(md.brand_album_id);


                var details = item.BrandAlbumDetail;

                foreach (var detail in details)
                {
                    var md_detail = md.BrandAlbumDetail.First(x => x.brand_album_detail_id == detail.brand_album_detail_id);
                    detail.sort = md_detail.sort;
                    detail.detail_name = md_detail.detail_name;
                }


                item.album_name = md.album_name;
                item.sort = md.sort;

                await db0.SaveChangesAsync();
                rAjaxResult.result = true;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(rAjaxResult);
        }
        public async Task<IHttpActionResult> Post([FromBody]BrandAlbum md)
        {
            md.brand_album_id = GetNewId(CodeTable.BrandAlbum);

            r = new ResultInfo<BrandAlbum>();
            if (!ModelState.IsValid)
            {
                r.message = ModelStateErrorPack();
                r.result = false;
                return Ok(r);
            }

            try
            {
                #region working
                db0 = getDB0();

                db0.BrandAlbum.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.brand_album_id;
                return Ok(r);
                #endregion
            }
            catch (DbEntityValidationException ex) //欄位驗證錯誤
            {
                r.message = getDbEntityValidationException(ex);
                r.result = false;
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message + "\r\n" + getErrorMessage(ex);
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
        public async Task<IHttpActionResult> Delete([FromUri]int id)
        {
            try
            {
                db0 = getDB0();
                r = new ResultInfo<BrandAlbum>();

                item = new BrandAlbum() { brand_album_id = id };
                db0.BrandAlbum.Attach(item);
                db0.BrandAlbum.Remove(item);

                await db0.SaveChangesAsync();

                r.result = true;
                return Ok(r);
            }
            catch (DbUpdateException ex)
            {
                r.result = false;
                if (ex.InnerException != null)
                {
                    r.message = Resources.Res.Log_Err_Delete_DetailExist;
                    // + "\r\n" + getErrorMessage(ex);
                }
                else
                {
                    r.message = ex.Message;
                }
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
    }
    public class q_BrandAlbum : QueryBase
    {
        public int brand_id { get; set; }
    }
}
