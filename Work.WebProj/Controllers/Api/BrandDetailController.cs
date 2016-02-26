using DotWeb.Helpers;
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
    public class BrandDetailController : ajaxApi<BrandDetail, q_BrandDetail>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.BrandDetail.FindAsync(id);
                r = new ResultInfo<BrandDetail>() { data = item };
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_BrandDetail q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.BrandDetail
                    .Where(x => x.brand_id == q.main_id)
                    .OrderByDescending(x => new { main_sort = x.Brand.sort, x.sort })
                    .Select(x => new m_BrandDetail()
                    {
                        brand_id = x.brand_id,
                        brand_detail_id = x.brand_detail_id,
                        detail_name = x.detail_name,
                        link_url = x.link_url,
                        sort = x.sort,
                        i_Hide = x.i_Hide,
                        edit_state = EditState.Update
                    });

                return Ok(items.ToList());
            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]BrandDetail md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.BrandDetail.FindAsync(md.brand_detail_id);

                item.detail_name = md.detail_name;
                item.brand_id = md.brand_id;
                item.link_url = md.link_url;
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
        public async Task<IHttpActionResult> Post([FromBody]BrandDetail md)
        {
            md.brand_detail_id = GetNewId(CodeTable.BrandDetail);

            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<BrandDetail>();
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

                db0.BrandDetail.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.brand_detail_id;
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
        public async Task<IHttpActionResult> Delete([FromUri]int[] ids)
        {
            try
            {
                db0 = getDB0();
                r = new ResultInfo<BrandDetail>();
                foreach (var id in ids)
                {
                    item = new BrandDetail() { brand_detail_id = id };
                    db0.BrandDetail.Attach(item);
                    db0.BrandDetail.Remove(item);
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
    public class q_BrandDetail : QueryBase
    {
        public int? main_id { get; set; }
    }
}
