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
    public class BrandUrlController : ajaxApi<BrandUrl, q_BrandUrl>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.BrandUrl.FindAsync(id);
                r = new ResultInfo<BrandUrl>() { data = item };
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri] q_BrandUrl q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.BrandUrl
                    .OrderByDescending(x => new { x.sort, x.brand_url_id })
                    .Select(x => new m_BrandUrl()
                    {
                        brand_url_id = x.brand_url_id,
                        brand_url_title = x.brand_url_title,
                        url = x.url,
                        sort = x.sort,
                        i_Hide = x.i_Hide
                    });
                if (q.keyword != null)
                {
                    items = items.Where(x => x.brand_url_title.Contains(q.keyword));
                }
                int page = (q.page == null ? 1 : (int)q.page);
                int startRecord = PageCount.PageInfo(page, this.defPageSize, items.Count());
                var resultItems = await items.Skip(startRecord).Take(this.defPageSize).ToListAsync();

                return Ok(new GridInfo<m_BrandUrl>()
                {
                    rows = resultItems,
                    total = PageCount.TotalPage,
                    page = PageCount.Page,
                    records = PageCount.RecordCount,
                    startcount = PageCount.StartCount,
                    endcount = PageCount.EndCount
                });
            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody] BrandUrl md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.BrandUrl.FindAsync(md.brand_url_id);

                item.brand_url_title = md.brand_url_title;
                item.url = RemoveScriptTag(md.url);
                item.sort = md.sort;
                item.i_Hide = md.i_Hide;

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
        public async Task<IHttpActionResult> Post([FromBody] BrandUrl md)
        {
            md.brand_url_id = GetNewId(CodeTable.BrandUrl);

            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<BrandUrl>();
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

                md.url = RemoveScriptTag(md.url);

                db0.BrandUrl.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.brand_url_id;
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
        public async Task<IHttpActionResult> Delete([FromUri] int[] ids)
        {
            try
            {
                db0 = getDB0();
                r = new ResultInfo<BrandUrl>();
                foreach (var id in ids)
                {
                    item = new BrandUrl() { brand_url_id = id };
                    db0.BrandUrl.Attach(item);
                    db0.BrandUrl.Remove(item);
                }
                await db0.SaveChangesAsync();

                r.result = true;
                return Ok(r);
            }
            catch (DbUpdateException ex)
            {
                r.result = false;
                if (ex.InnerException != null)
                {
                    r.message = Resources.Res.Log_Err_Delete_DetailExist
                        + "\r\n" + getErrorMessage(ex);
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
    public class q_BrandUrl : QueryBase
    {
        public string keyword { get; set; }
    }
}
